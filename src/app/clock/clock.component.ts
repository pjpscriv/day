import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MS_PER_DAY, NUMBER_OF_HOURS } from '../day.consts';
import { getDayMilliseconds } from '../day.helpers';
import { Place, Wellington } from '../types/place.type';

declare var SunCalc: any;
const font_color  = "white";
const line_width  = 4;
const DAY_COLOR   = "rgb(62, 88, 128)";
const NIGHT_COLOR = "#222222";
const TRANSPARENT = "transparent";

@Component({
  selector: 'clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnChanges {
  @Input() public time: Date;
  @Input() public place: Place | null;
  public sunTimes: any;
  public sunrise: string;
  public sunset: string;
  public hours = Array(NUMBER_OF_HOURS).fill(0).map((_, i) => i);

  constructor(
    private elRef: ElementRef,
    private datePipe: DatePipe
  ) {
    this.time = new Date();
    this.place = Wellington;
    this.sunrise = 'Sunrise';
    this.sunset = 'Sunset';
    this.elRef.nativeElement.style.backgroundColour = DAY_COLOR;
  }


  public ngOnChanges(changes: SimpleChanges): void {
    const { time, place } = changes;

    this.time = time?.currentValue ?? this.time;
    this.place = place?.currentValue ?? this.place;

    if (!this.time || !this.place) return;

    this.sunTimes = this.getSunTimes(this.time, this.place);
    let gradient = `linear-gradient(0rad, ${NIGHT_COLOR} 50%, ${NIGHT_COLOR} 50%)`;
    let bgColor = NIGHT_COLOR;

    if (this.hasSunriseAndSunset(this.sunTimes)) {
      this.sunrise = this.datePipe.transform(this.sunTimes.sunrise, 'h:mm a') ?? '';
      this.sunset = this.datePipe.transform(this.sunTimes.sunset, 'h:mm a') ?? '';

      let sunriseAngle = this.getAngle(this.sunTimes.sunrise);
      let sunsetAngle  = this.getAngle(this.sunTimes.sunset);
      gradient = this.getGradient(sunriseAngle, sunsetAngle, this.dayLongerThanNight(this.sunTimes));
      bgColor = this.dayLongerThanNight(this.sunTimes) ? NIGHT_COLOR : DAY_COLOR;

    } else {
      if (isNaN(this.sunTimes.night)) {
        gradient = `linear-gradient(0rad, ${DAY_COLOR} 50%, ${DAY_COLOR} 50%)`;
      }

      this.sunrise = 'No Sunrise';
      this.sunset = 'No Sunset';
    }

    this.elRef.nativeElement.style.backgroundImage = gradient;
    this.elRef.nativeElement.style.backgroundColor = bgColor;

    // // Tomorrow's nadir for nice Daylight Savings behaviour
    // this.addTime(new Date(this.sunTimes.nadir.getTime() + MS_PER_DAY), 'nadir');
  }

  public hasSunriseAndSunset(sunTimes: any): boolean {
    return !isNaN(sunTimes.sunrise) && !isNaN(sunTimes.sunset);
  }

  public dayLongerThanNight(sunTimes: any): boolean {
    return (sunTimes.sunset - sunTimes.sunrise) > (MS_PER_DAY / 2);
  }

  public getGradient(sunriseAngle: any, sunsetAngle: any, isDay: boolean): string {
    const colour1 = isDay ? TRANSPARENT : NIGHT_COLOR;
    const colour2 = isDay ? DAY_COLOR : TRANSPARENT;
    return `linear-gradient(${sunriseAngle}rad, ${colour1} 50%, ${colour2} 50%),
            linear-gradient(${sunsetAngle}rad, ${colour2} 50%, ${colour1} 50%)`;
  }

  public getPosition(name: string, hour?: number): any {
    if (!this.sunTimes) return
    const dp = 1000;
    let rotation = 0;
    switch (name) {
      case 'hour':
        rotation = (hour ?? 0) * 2 * Math.PI / NUMBER_OF_HOURS;
        break;
      case 'nadir':
        rotation = this.getRotation(this.sunTimes.nadir); // TODO: Maybe adapt here?
        break;
      case 'solarnoon':
        rotation = this.getRotation(this.sunTimes.solarNoon);
        break;
      case 'now':
        rotation = this.getRotation(this.time);
        break;
    }
    const y = Math.round((Math.sin(rotation) * 36.6) * dp) / dp * -1;
    const x = Math.round((Math.cos(rotation) * 36.6) * dp) / dp;
    return `translate(${y}vmin, ${x}vmin) rotate(${rotation}rad)`;
  }

  private getRotation(date: Date): number {
    return 2 * Math.PI * (getDayMilliseconds(date) / MS_PER_DAY);
  }

  private getSunTimes(time: Date, place: Place): any {
    return SunCalc.getTimes(time, place.latitude, place.longitude);
  }

  private getAngle(date: Date): number {
    var ms = getDayMilliseconds(date);
    var circle_percent = ms / MS_PER_DAY;
    return (circle_percent * 2 * Math.PI) - Math.PI / 2;
  }
}
