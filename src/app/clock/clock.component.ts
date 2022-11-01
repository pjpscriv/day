import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, combineLatest, map, takeUntil, tap } from 'rxjs';
import { MS_PER_DAY, NUMBER_OF_HOURS } from '../day.consts';
import { getDayMilliseconds } from '../day.helpers';
import { selectTime } from '../state/day.selectors';
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
export class ClockComponent implements OnChanges, OnInit, OnDestroy {
  public hoursList = Array(NUMBER_OF_HOURS).fill(0).map((_, i) => i);
  public sunTimes: any;

  public sunrise$ = new Observable<string>();
  public sunset$ = new Observable<string>();

  @Input() public place: Place | null;
  private place$ = new Subject<Place>();

  private destroy$ = new Subject();

  constructor(
    private elRef: ElementRef,
    private datePipe: DatePipe,
    private store: Store
  ) {
    this.place = Wellington;
    this.elRef.nativeElement.style.backgroundColour = DAY_COLOR;
  }

  public ngOnInit(): void {

    const time$ = this.store.select(selectTime) as Observable<Date>;

    const suntime$ = combineLatest([time$, this.place$]).pipe(
      takeUntil(this.destroy$),
      map(([time, place]) => this.getSunTimes(time, place)),
      tap(sunTimes => this.sunTimes = sunTimes)
    )

    this.sunrise$ = suntime$.pipe(
      map(sunTimes => this.hasSunriseAndSunset(sunTimes) ? this.datePipe.transform(sunTimes.sunrise, 'h:mm a') ?? '' : 'No Sunrise')
    );

    this.sunset$ = suntime$.pipe(
      map(sunTimes => this.hasSunriseAndSunset(sunTimes) ? this.datePipe.transform(sunTimes.sunset, 'h:mm a') ?? '' : 'No Sunset')
    );

    // Gradient
    suntime$.subscribe((sunTimes: any) => {
      let gradient = `linear-gradient(0rad, ${NIGHT_COLOR} 50%, ${NIGHT_COLOR} 50%)`;
      let bgColor = NIGHT_COLOR;

      if (this.hasSunriseAndSunset(sunTimes)) {
        let sunriseAngle = this.getAngle(sunTimes.sunrise);
        let sunsetAngle  = this.getAngle(sunTimes.sunset);
        let dayLongerThanNight = this.dayLongerThanNight(sunTimes);
        gradient = this.getGradient(sunriseAngle, sunsetAngle, dayLongerThanNight);
        bgColor = dayLongerThanNight ? NIGHT_COLOR : DAY_COLOR;

      } else {
        if (isNaN(this.sunTimes.night)) {
          gradient = `linear-gradient(0rad, ${DAY_COLOR} 50%, ${DAY_COLOR} 50%)`;
        }
      }

      this.elRef.nativeElement.style.backgroundImage = gradient;
      this.elRef.nativeElement.style.backgroundColor = bgColor;

      // // Tomorrow's nadir for nice Daylight Savings behaviour
      // this.addTime(new Date(this.sunTimes.nadir.getTime() + MS_PER_DAY), 'nadir');
    })

  }


  public ngOnChanges(changes: SimpleChanges): void {
    const { place } = changes;
    this.place = place?.currentValue ?? this.place;
    if (!this.place) return;
    this.place$.next(this.place);
  }

  public onResize(event: any): void {
    // Just here to trigger getPosition() on resize
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
    const dp = 1000;
    let rotation = 0;
    let length = 6;
    switch (name) {
      case 'hour':
        rotation = (hour ?? 0) * 2 * Math.PI / NUMBER_OF_HOURS;
        length = 2;
        break;
      case 'nadir':
        rotation = !!this.sunTimes ? this.getRotation(this.sunTimes.nadir) : 0; // TODO: Maybe adapt here?
        break;
      case 'solarnoon':
        rotation = !!this.sunTimes ? this.getRotation(this.sunTimes.solarNoon) : Math.PI;
        break;
      case 'now':
        rotation = !!this.sunTimes ? this.getRotation(new Date()) : 0;
        break;
    }

    let radFromWidth = window.innerWidth * 0.75;
    let height = Math.max(window.innerHeight, document.documentElement.clientHeight)
    let radFromHeight = (height - 120) * 0.8;
    const radius = Math.min(radFromWidth, radFromHeight) * 0.5;

    const radiusShift = 1 - (length / 75);

    const y = Math.round((Math.sin(rotation) * radius * radiusShift) * dp) / dp * -1;
    const x = Math.round((Math.cos(rotation) * radius * radiusShift) * dp) / dp;

    return `translate(${y}px, ${x}px) rotate(${rotation}rad)`;
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

  public ngOnDestroy(): void {
    this.destroy$.next(null);
  }
}
