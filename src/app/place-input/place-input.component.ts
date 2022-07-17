import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { Place, Wellington } from '../types/place.type';


@Component({
  selector: 'place-input',
  templateUrl: './place-input.component.html',
  styleUrls: ['./place-input.component.scss']
})
export class PlaceInputComponent implements OnInit {
  public place: Place;
  public value: string = '';
  public autocompletePlaces$ = new Observable<any[]>();
  public showLatLongInput = false;
  public textInputFormControl = new FormControl()

  constructor() {
    this.place = Wellington;
    this.textInputFormControl.setValue(this.place.name);
  }

  ngOnInit(): void {
    this.autocompletePlaces$ = this.textInputFormControl.valueChanges.pipe(
      map(value => {
        return ['A', 'Set', 'Of', 'Test', 'Values'].slice(value.length)
      })
    )

    // Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          this.place = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: 'Your location'
          }
        },
        (_) => {
          console.log('Position not given');
        }
      );
    } else {
        console.log("Your browser is too old to share your location :'(");
    }
  }

  public toggleInputType(): void {
    this.showLatLongInput = !this.showLatLongInput;
  }
}
