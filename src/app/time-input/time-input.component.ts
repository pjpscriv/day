import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.css']
})
export class TimeInputComponent implements OnInit {
  @Input() public time = new Date();
  @Output() public timeChange = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
