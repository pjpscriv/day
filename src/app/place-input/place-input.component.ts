import { Component, OnInit } from '@angular/core';
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
  public place$ = new Subject<Place>();
  public value: string = '';
  public autocompletePlaces$ = new Observable<any[]>();
  public showLatLongInput = false;
  public textInputFormControl = new FormControl()

  constructor() {
    this.place = Wellington;
    this.place$.next(Wellington);
    this.textInputFormControl.setValue(this.place.name);
  }

  ngOnInit(): void {
    this.autocompletePlaces$ = this.textInputFormControl.valueChanges.pipe(
      map(value => ['A', 'Set', 'Of', 'Test', 'Values'].slice(value.length))
    )

    if (!navigator.geolocation) {
      console.log("Your browser is too old to share your location :'(");
      return;
    }

    // Get User's Location
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        this.place = { latitude: position.coords.latitude, longitude: position.coords.longitude, name: 'Your location' }
      },
      (_) => console.log('Position not given')
    );
  }

  public onLatChange(event: any): void {
    this.place.latitude = +event?.target?.value;
    this.place$.next(this.copyPlace(this.place));
  }

  public onLongChange(event: any): void {
    this.place.longitude = +event?.target?.value;
    this.place$.next(this.copyPlace(this.place));
  }

  public toggleInputType(): void {
    this.showLatLongInput = !this.showLatLongInput;
  }

  private copyPlace(place: Place): Place {
    return {
      latitude: place.latitude,
      longitude: place.longitude,
      name: place.name
    }
  }
}
