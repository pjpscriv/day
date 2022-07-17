import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'place-input',
  templateUrl: './place-input.component.html',
  styleUrls: ['./place-input.component.css']
})
export class PlaceInputComponent implements OnInit {
  @Input() public place: any;
  @Output() public placeChange = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
