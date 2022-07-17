import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, Subject } from 'rxjs';
import { Place, Wellington } from '../types/place.type';


@Component({
  selector: 'place-input',
  templateUrl: './place-input.component.html',
  styleUrls: ['./place-input.component.scss']
})
export class PlaceInputComponent implements OnInit {
  public place: Place;
  @Output() public placeChange = new EventEmitter();
  public value: string = '';
  public autocompletePlaces$ = new Observable<any[]>();
  public showLatLongInput = false;
  public textInputFormControl = new FormControl()

  constructor() {
    this.place = Wellington;
  }

  ngOnInit(): void {
    this.autocompletePlaces$ = this.textInputFormControl.valueChanges.pipe(
      map(value => {
        return ['A', 'Set', 'Of', 'Test', 'Values'].slice(value.length)
      })
    )
  }

  public toggleInputType(): void {
    this.showLatLongInput = !this.showLatLongInput;
  }

}
