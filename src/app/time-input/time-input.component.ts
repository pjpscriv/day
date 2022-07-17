import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent {
  public time = new Date();
  // @Output() public timeChange = new EventEmitter();

  public onDateChange(event: MatDatepickerInputEvent<any, any>): void {
    this.time = event.value;
  }
}
