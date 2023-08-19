import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Store } from '@ngrx/store';
import { MS_PER_DAY } from '../day.consts';
import { UpdateTimeAction } from '../state/day.actions';

@Component({
  selector: 'time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent implements OnInit {
  public time: Date;
  private repeater: any;

  constructor(
    private store: Store
  ) {
    this.time = new Date();
  }

  public ngOnInit() {
    this.store.dispatch(UpdateTimeAction({ time: this.time }));
  }

  public onDateChange(event: MatDatepickerInputEvent<any, any>): void {
    if (!!event.value) {
      this.time = event.value;
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

  public timeWarpForwards(): void {
    this.repeater = setInterval(() => this.nextDay(), 20);
  }

  public timeWarpBackwards(): void {
    this.repeater = setInterval(() => this.previousDay(), 20);
  }

  public stopTimeWarp(): void {
    clearInterval(this.repeater);
  }
}
