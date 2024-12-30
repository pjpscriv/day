import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, shareReplay, startWith, Subject, takeUntil, tap, timer } from 'rxjs';
import { MS_PER_DAY, NUMBER_OF_HOURS } from '../day.consts';
import { getDayMilliseconds } from '../day.helpers';
import { selectPlace, selectTime } from '../state/day.selectors';
import { Place } from '../types/place.type';
import { hasSunriseAndSunset, dayLongerThanNight, SunTimesType, SunTimesDisplayData, convertToPlaceTimes } from '../types/sunTimes.type';
import * as SunCalc from 'suncalc';
import { TimeDisplay } from '../types/timeDisplay.type';

// TODO: Move to (UI?) constants file
const NUMBER_OF_MINUTES = NUMBER_OF_HOURS * 6;
const SUN_MOON_INDENT = 13;
const LABEL_INDENT = 25;

@Component({
  selector: 'clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit, OnDestroy {
  public hoursList = Array(NUMBER_OF_HOURS).fill(0).map((_, i) => i);
  public minutes = Array(NUMBER_OF_MINUTES).fill(0).map((_, i) => i).filter(v => v % 6 != 0)

  public displayData$ = new Observable<SunTimesDisplayData>();
  public nowData$ = new Observable<TimeDisplay>();
  public gradient$ = new Observable<any>();
  public maskMode$ = new Observable<string>();

  private resize$ = new Subject();
  private destroy$ = new Subject<void>();

  constructor(
    private elRef: ElementRef,
    private store: Store
  ) {}

  public ngOnInit(): void {
    // Inputs
    const time$ = this.store.select(selectTime);
    const place$ = this.store.select(selectPlace);
    const sunTime$ = combineLatest([time$, place$]).pipe(
      map(([time, place]: [Date, Place]) => [SunCalc.getTimes(time, place.latitude, place.longitude), place] as [SunTimesType, Place]),
      map(([sunTimes, place]: [SunTimesType, Place]) => convertToPlaceTimes(sunTimes, place)),
      takeUntil(this.destroy$)
    )
    const resize$ = this.resize$.pipe(startWith(null));
    const seconds$ = combineLatest([timer(0, 1000), place$]).pipe(
      map(([_, place]) => {
        let offset = place.utcOffset - (new Date().getTimezoneOffset() * -1);
        return new Date(new Date().getTime() + (offset * 60 * 1000));
      }));

    // Outputs
    this.displayData$ = combineLatest([sunTime$, resize$]).pipe(
      map(([st, _]) => this.getDisplayData(st))
    );
    // TODO: Combine these into a single observable
    this.gradient$ = sunTime$.pipe(
      map(st => this.getGradient(st))
    );
    this.maskMode$ = sunTime$.pipe(
      map(st => dayLongerThanNight(st) ? 'add' : 'subtract')
    );
    this.nowData$ = combineLatest([seconds$, resize$]).pipe(
      map(([d, _]) => this.getNowData(d)),
      shareReplay(),
      takeUntil(this.destroy$)
    );
  }

  private getDisplayData(sunTimes: SunTimesType): SunTimesDisplayData {
    let sunrise = hasSunriseAndSunset(sunTimes) ? sunTimes.sunrise : null;
    let sunset = hasSunriseAndSunset(sunTimes) ? sunTimes.sunset : null;
    let solarNoon = sunTimes.solarNoon;
    let nadir = sunTimes.nadir;

    return {
      sunrise: {
        time: sunrise,
        position: this.getTranslation(sunrise ? this.getRotation(sunrise) : 0, sunrise ? 20 : 50, false), 
      },
      sunset: {
        time: sunset,
        position: this.getTranslation(sunset ? this.getRotation(sunset) : Math.PI, sunset ? 20 : 50, false), 
      },
      solarNoon: {
        time: solarNoon,
        position: this.getTranslation(solarNoon ? this.getRotation(solarNoon) : Math.PI, LABEL_INDENT, false), 
        dotPosition: this.getTranslation(solarNoon ? this.getRotation(solarNoon) : Math.PI, SUN_MOON_INDENT)
      },
      nadir: {
        time: nadir,
        position: this.getTranslation(nadir ? this.getRotation(nadir) : Math.PI, LABEL_INDENT, false),
        dotPosition: this.getTranslation(nadir ? this.getRotation(nadir) : 0, SUN_MOON_INDENT)
      }
    }
  }

  private getGradient(sunTimes: SunTimesType): string {
    const DAY = "linear-gradient(white, white)";
    const NIGHT = "linear-gradient(transparent, transparent)";

    if (!hasSunriseAndSunset(sunTimes)) {
      return (isNaN(sunTimes.night.getTime())) ? DAY : NIGHT;
    }

    let sunriseAngle = this.getAngle(sunTimes.sunrise as Date);
    let sunsetAngle  = this.getAngle(sunTimes.sunset as Date);
    let dayLong = dayLongerThanNight(sunTimes);
    
    const transp = 'transparent';
    const fill = "white";
    return `linear-gradient(${sunriseAngle}rad, ${transp} 50%, ${fill} 50%),
            linear-gradient(${sunsetAngle}rad, ${!dayLong ? transp : fill} 50%, ${!dayLong ? fill : transp} 50%)`;
  }

  private getNowData(time: Date): TimeDisplay {
    const rad = this.getRadius();
    const rotation = this.getRotation(time);
    const isAbove = (Math.PI * 0.5) < rotation && rotation < (Math.PI * 1.5);
    const dotPosition = this.getTranslation(rotation, 3);
    const label = {
      viewBox: `0 0 ${rad * 2} ${rad * 2}`,
      path: this.getBorderPath(),
      pathRotate: `rotate(${this.getRotation(time) - Math.PI}rad)`,
      pathTransform: `translate(${rad}, ${rad})`,
      isAbove: isAbove
    }
    return { time, rotation, dotPosition, label };
  }

  private getBorderPath(): string {
    const r = this.getRadius();
    
    // Generate the path string for a circle in a single line
    const path =
      `M ${0} ${r}` + 
      `A ${r} ${r} 0 1 1 ${0} ${-r}` + 
      `A ${r} ${r} 0 1 1 ${0} ${r}` +
      `M ${0} ${r}` + 
      `A ${r} ${r} 0 1 0 ${0} ${-r}` + 
      `A ${r} ${r} 0 1 0 ${0} ${r}` +
      `Z`;

    return path;
  }

  public getHourPosition(hour?: number): string {
    const rotation = (hour ?? 0) * 2 * Math.PI / NUMBER_OF_HOURS;
    return this.getTranslation(rotation, 5);
  }

  public getMinutePosition(min?: number): any {
    const rotation = (min ?? 0) * 2 * Math.PI / NUMBER_OF_MINUTES;
    return this.getTranslation(rotation, 3);
  }

  private getRotation(date: Date): number {
    return 2 * Math.PI * (getDayMilliseconds(date) / MS_PER_DAY);
  }

  private getTranslation(rotation: number, length: number = 6, includeRotation: boolean = true) {
    const dp = 1000;
    const radius = this.getRadius();
    const radiusShift = 1 - (length / 75);

    const y = Math.round((Math.sin(rotation) * radius * radiusShift) * dp) / dp * -1;
    const x = Math.round((Math.cos(rotation) * radius * radiusShift) * dp) / dp;

    return `translate(${y}px, ${x}px) rotate(${includeRotation ? rotation : 0}rad)`;
  }

  private getRadius(): number {
    // TODO: Read from ElementRef instead of window
    const radFromWidth = window.innerWidth * 0.75;
    const height = Math.max(window.innerHeight, document.documentElement.clientHeight)
    const radFromHeight = (height - 120) * 0.8;
    const radius = Math.min(radFromWidth, radFromHeight) * 0.5;
    return radius
  }

  private getAngle(date: Date): number {
    const ms = getDayMilliseconds(date);
    const circle_percent = ms / MS_PER_DAY;
    return (circle_percent * 2 * Math.PI) - Math.PI / 2;
  }

  public onResize(_: any): void {
    this.resize$.next(null);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }
}
