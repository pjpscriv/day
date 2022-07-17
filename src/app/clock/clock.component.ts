import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MS_PER_DAY, NUMBER_OF_HOURS } from '../day.consts';
import { getDayMilliseconds } from '../day.helpers';
import { Place, Wellington } from '../types/place.type';

declare var SunCalc: any;
const font_color  = "white";
const line_width  = 4;

@Component({
  selector: 'clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnChanges {
  @Input() public time: Date;
  @Input() public place: Place;
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
  }


  public ngOnChanges(changes: SimpleChanges): void {
    const { time, place } = changes;

    this.time = time?.currentValue ?? this.time;
    this.place = place?.currentValue ?? this.place;

    if (!this.time || !this.place) return;

    this.sunTimes = this.getSunTimes(this.time, this.place);

    const transparent = "transparent";
    let gradient;
    const day_color   = "rgb(62, 88, 128)";
    const night_color = "#222222";

    // Check day has sunrise & sunset
    if (!isNaN(this.sunTimes.sunrise) && !isNaN(this.sunTimes.sunset)) {

      // Set Gradients
      var sunriseAngle = this.getAngle(this.sunTimes.sunrise);
      var sunsetAngle  = this.getAngle(this.sunTimes.sunset);
      if ((this.sunTimes.sunset - this.sunTimes.sunrise) > (MS_PER_DAY / 2)) {
          // Longer Day
          gradient = `linear-gradient(${sunriseAngle}rad, ${transparent} 50%, ${day_color} 50%),
                      linear-gradient(${sunsetAngle}rad, ${transparent} 50%, ${night_color} 50%)`;
      } else {
          // Longer Night
          gradient = `linear-gradient(${sunriseAngle}rad, ${night_color} 50%, ${transparent} 50%),
                      linear-gradient(${sunsetAngle}rad, ${transparent} 50%, ${night_color} 50%)`
      }

      this.sunrise = this.datePipe.transform(this.sunTimes.sunrise, 'h:mm a') ?? '';
      this.sunset = this.datePipe.transform(this.sunTimes.sunset, 'h:mm a') ?? '';

    } else {
      // Hack - should be a better way of doing this
      if (isNaN(this.sunTimes.night)) {
        gradient = `linear-gradient(0rad, ${day_color} 50%, ${day_color} 50%)`;
      } else {
        gradient = `linear-gradient(0rad, ${night_color} 50%, ${night_color} 50%)`;
      }

      this.sunrise = 'No Sunrise';
      this.sunset = 'No Sunset';
    }

    this.elRef.nativeElement.style.backgroundImage = gradient;
    // Add Times
    // this.addTime(time, 'now');
    // this.addTime(this.sunTimes.solarNoon, 'solarnoon');
    // // Tomorrow's nadir for nice Daylight Savings behaviour
    // this.addTime(new Date(this.sunTimes.nadir.getTime() + MS_PER_DAY), 'nadir');
  }


  public getPosition(name: string, hour?: number): any {
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
