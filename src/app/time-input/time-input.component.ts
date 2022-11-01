import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Store } from '@ngrx/store';
import { MS_PER_DAY } from '../day.consts';

@Component({
  selector: 'time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent {
  public time: Date;
  private repeater: any;

  constructor(
    private store: Store
  ) {
    this.time = new Date();
  }

  public onDateChange(event: MatDatepickerInputEvent<any, any>): void {
    if (!!event.value) {
      this.time = event.value;
    }
  }

  public nextDay(): void {
    this.time = new Date(this.time.getTime() + MS_PER_DAY);
  }

  public previousDay(): void {
    this.time = new Date(this.time.getTime() - MS_PER_DAY);
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
