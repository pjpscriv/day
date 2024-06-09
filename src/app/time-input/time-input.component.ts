import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Store } from '@ngrx/store';
import { MS_PER_DAY } from '../day.consts';
import { UpdateTimeAction } from '../state/day.actions';
import { selectTime } from '../state/day.selectors';
import { Subject, filter, takeUntil, tap } from 'rxjs';

export const TIMEWARP_HOLD_DELAY = 500;
export const TIMEWARP_INTERVAL = 20;

@Component({
  selector: 'time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent implements OnInit, OnDestroy {
  public time: Date;

  private timeWarpHoldActive: boolean = false;
  private repeater: any;

  private destroyed$ = new Subject<void>();

  constructor(
    private store: Store
  ) {
    this.time = new Date();

    // Check for resets
    this.store.select(selectTime).pipe(
      filter((time: Date) => time != this.time),
      takeUntil(this.destroyed$)
    ).subscribe((time: Date) => {
      this.stopTimeWarp()
      this.time = time;
    })
  }

  public ngOnInit() {
    this.store.dispatch(UpdateTimeAction({ time: this.time }));
  }

  public onDateChange(event: MatDatepickerInputEvent<any, any>): void {
    if (!!event.value) {
      this.time = event.value.toDate();
      this.store.dispatch(UpdateTimeAction({ time: this.time }));
    }
  }

  public nextDay(): void {
    this.time = new Date(this.time.getTime() + MS_PER_DAY);
    this.store.dispatch(UpdateTimeAction({ time: this.time }));
  }

  public previousDay(): void {
    this.time = new Date(this.time.getTime() - MS_PER_DAY);
    this.store.dispatch(UpdateTimeAction({ time: this.time }));
  }

  public nextDayThenTimeWarp(): void {
    this.nextDay();
    this.timeWarpHoldActive = true;
    
    setTimeout(() => {
        if (this.timeWarpHoldActive) {
          this.timeWarpForwards(TIMEWARP_INTERVAL);
        }
    }, TIMEWARP_HOLD_DELAY)
  } 

  public previousDayThenTimeWarp(): void {
    this.previousDay();
    this.timeWarpHoldActive = true;
    
    setTimeout(() => {
        if (this.timeWarpHoldActive) {
          this.timeWarpBackwards(TIMEWARP_INTERVAL);
        }
    }, TIMEWARP_HOLD_DELAY)
  }

  public timeWarpForwards(interval: number): void {
    this.stopTimeWarp();
    this.repeater = setInterval(() => this.nextDay(), interval);
  }

  public timeWarpBackwards(interval: number): void {
    this.stopTimeWarp();
    this.repeater = setInterval((interval: number) => this.previousDay(), interval);
  }

  public stopTimeWarp(): void {
    this.timeWarpHoldActive = false;
    clearInterval(this.repeater);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
