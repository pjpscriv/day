import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, startWith, Subject, takeUntil, tap, timer } from 'rxjs';
import { MS_PER_DAY, NUMBER_OF_HOURS } from '../day.consts';
import { getDayMilliseconds } from '../day.helpers';
import { selectPlace, selectTime } from '../state/day.selectors';
import { Place } from '../types/place.type';
import { startingTime, SunTimesType } from '../types/sunTimes.type';

declare var SunCalc: any;

const DAY_COLOR   = "rgb(62, 88, 128)";
const NIGHT_COLOR = "#222222";
const NUMBER_OF_MINUTES = NUMBER_OF_HOURS * 6;

@Component({
  selector: 'clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit, OnDestroy {
  public hoursList = Array(NUMBER_OF_HOURS).fill(0).map((_, i) => i);
  public minutes = Array(NUMBER_OF_MINUTES).fill(0).map((_, i) => i).filter(v => v % 6 != 0)
  public sunTimes: SunTimesType = startingTime;

  public sunrise$ = new Observable<string>();
  public sunset$ = new Observable<string>();
  public solarNoon$ = new Observable<string>();
  public nadir$ = new Observable<string>();

  public sunrisePosition$ = new Observable<any>();
  public sunsetPosition$ = new Observable<any>();
  public solarNoonLabelPosition$ = new Observable<any>();
  public nadirLabelPosition$ = new Observable<any>();

  public nadirPosition$ = new Observable<any>();
  public solarNoonPosition$ = new Observable<any>();
  public nowPosition$ = new Observable<any>();

  private resize$ = new Subject();
  private destroy$ = new Subject();

  constructor(
    private elRef: ElementRef,
    private datePipe: DatePipe,
    private store: Store
  ) {
    // this.place = Wellington;
    this.elRef.nativeElement.style.backgroundColour = DAY_COLOR;
  }

  public ngOnInit(): void {

    // Inputs
    const time$ = this.store.select(selectTime) as Observable<Date>;
    const place$ = this.store.select(selectPlace) as Observable<Place>;

    const sunTime$: Observable<SunTimesType> = combineLatest([time$, place$]).pipe(
      takeUntil(this.destroy$),
      map(([time, place]) => this.getSunTimes(time, place)),
      tap(sunTimes => this.sunTimes = sunTimes),
    )

    const resize$ = this.resize$.pipe(startWith(null));

    // Outputs
    this.sunrise$ = sunTime$.pipe(
      map(sunTimes => this.hasSunriseAndSunset(sunTimes) ? this.datePipe.transform(sunTimes.sunrise, 'h:mm a') ?? '' : 'No Sunrise')
    );
    this.sunrisePosition$ = combineLatest([sunTime$, resize$]).pipe(
      map(([st, _]) => !!st?.sunrise ? this.getRotation(st.sunrise) : 0),
      map(r => this.getTranslation(r, 20, false))
    );

    this.sunset$ = sunTime$.pipe(
      map(sunTimes => this.hasSunriseAndSunset(sunTimes) ? this.datePipe.transform(sunTimes.sunset, 'h:mm a') ?? '' : 'No Sunset')
    );
    this.sunsetPosition$ = combineLatest([sunTime$, resize$]).pipe(
      map(([st, _]) => !!st?.sunset ? this.getRotation(st.sunset) : Math.PI),
      map(r => this.getTranslation(r, 20, false))
    );

    this.solarNoon$ = sunTime$.pipe(
      map(sunTimes => this.datePipe.transform(sunTimes.solarNoon, 'h:mm a') ?? '')
    )
    this.solarNoonLabelPosition$ = combineLatest([sunTime$, resize$]).pipe(
      map(([st, _]) => !!st?.solarNoon ? this.getRotation(st.solarNoon) : Math.PI),
      map(r => this.getTranslation(r, 20, false))
    );
    this.solarNoonPosition$ = combineLatest([sunTime$, resize$]).pipe(
      map(([st, _]) => !!st?.solarNoon ? this.getRotation(st.solarNoon) : Math.PI),
      map(r => this.getTranslation(r))
    );

    this.nadir$ = sunTime$.pipe(
      map(sunTimes => this.datePipe.transform(sunTimes.nadir, 'h:mm a') ?? '')
    )
    this.nadirLabelPosition$ = combineLatest([sunTime$, resize$]).pipe(
      map(([st, _]) => !!st?.nadir ? this.getRotation(st.nadir) : Math.PI),
      map(r => this.getTranslation(r, 14, false))
    );
    this.nadirPosition$ = combineLatest([sunTime$, resize$]).pipe(
      map(([st, _]) => !!st?.nadir ? this.getRotation(st.nadir) : 0),
      map(r => this.getTranslation(r))
    );


    // NB: Updates every second
    this.nowPosition$ = combineLatest([timer(0, 1000 ), resize$]).pipe(
      startWith([null, null]),
      map(([i, _]) => this.getRotation(new Date())),
      map(r => this.getTranslation(r)),
      // tap(_ => console.count('hello'))
    );

    // Gradient
    sunTime$.subscribe((sunTimes: SunTimesType) => {
      let gradient = `linear-gradient(0rad, ${NIGHT_COLOR} 50%, ${NIGHT_COLOR} 50%)`;
      let bgColor = NIGHT_COLOR;

      if (this.hasSunriseAndSunset(sunTimes)) {
        let sunriseAngle = this.getAngle(sunTimes.sunrise as Date);
        let sunsetAngle  = this.getAngle(sunTimes.sunset as Date);
        let dayLongerThanNight = this.dayLongerThanNight(sunTimes);
        gradient = this.getGradient(sunriseAngle, sunsetAngle, dayLongerThanNight);
        bgColor = dayLongerThanNight ? NIGHT_COLOR : DAY_COLOR;

      } else {
        if (sunTimes.night === null) {
          gradient = `linear-gradient(0rad, ${DAY_COLOR} 50%, ${DAY_COLOR} 50%)`;
        }
      }

      this.elRef.nativeElement.style.backgroundImage = gradient;
      this.elRef.nativeElement.style.backgroundColor = bgColor;

      // Tomorrow's nadir for nice Daylight Savings behaviour
      // this.addTime(new Date(this.sunTimes.nadir.getTime() + MS_PER_DAY), 'nadir');
    })

  }

  public onResize(event: any): void {
    // Just here to trigger getPosition() on resize
    this.resize$.next(null);
  }

  public hasSunriseAndSunset(sunTimes: any): boolean {
    return !isNaN(sunTimes.sunrise) && !isNaN(sunTimes.sunset);
  }

  public dayLongerThanNight(sunTimes: any): boolean {
    return (sunTimes.sunset - sunTimes.sunrise) > (MS_PER_DAY / 2);
  }

  public getGradient(sunriseAngle: any, sunsetAngle: any, isDay: boolean): string {
    const colour1 : string = isDay ? 'transparent' : NIGHT_COLOR;
    const colour2 : string = isDay ? DAY_COLOR : 'transparent';
    return `linear-gradient(${sunriseAngle}rad, ${colour1} 50%, ${colour2} 50%),
            linear-gradient(${sunsetAngle}rad, ${colour2} 50%, ${colour1} 50%)`;
  }

  public getHourPosition(hour?: number): any {
    const rotation = (hour ?? 0) * 2 * Math.PI / NUMBER_OF_HOURS;
    return this.getTranslation(rotation, 2);
  }

  public getMinutePosition(min?: number): any {
    const rotation = (min ?? 0) * 2 * Math.PI / NUMBER_OF_MINUTES;
    return this.getTranslation(rotation, 1);
  }

  private getRotation(date: Date): number {
    return 2 * Math.PI * (getDayMilliseconds(date) / MS_PER_DAY);
  }

  private getTranslation(rotation: number, length: number = 6, includeRotation: boolean = true) {
    const dp = 1000;

    const radFromWidth = window.innerWidth * 0.75;
    const height = Math.max(window.innerHeight, document.documentElement.clientHeight)
    const radFromHeight = (height - 120) * 0.8;
    const radius = Math.min(radFromWidth, radFromHeight) * 0.5;

    const radiusShift = 1 - (length / 75);

    const y = Math.round((Math.sin(rotation) * radius * radiusShift) * dp) / dp * -1;
    const x = Math.round((Math.cos(rotation) * radius * radiusShift) * dp) / dp;

    return `translate(${y}px, ${x}px) rotate(${includeRotation ? rotation : 0}rad)`;
  }

  private getSunTimes(time: Date, place: Place): any {
    return SunCalc.getTimes(time, place.latitude, place.longitude);
  }

  private getAngle(date: Date): number {
    let ms = getDayMilliseconds(date);
    let circle_percent = ms / MS_PER_DAY;
    return (circle_percent * 2 * Math.PI) - Math.PI / 2;
  }

  public ngOnDestroy(): void {
    this.destroy$.next(null);
  }
}
