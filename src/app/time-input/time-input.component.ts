import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MS_PER_DAY } from '../day.consts';

@Component({
  selector: 'time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent {
  public time: Date;

  constructor() {
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

  public startFastForwards(): void {
    console.log('Called startFastForwards()');
  }

  public startFastBackwards(): void {
    console.log('Called startFastBackwards()');
  }

  public endFastForwards(): void {
    console.log('Called endFastForawrds()');
  }

  public endFastBackwards(): void {
    console.log('Called endFastBackwards()');
  }
}
