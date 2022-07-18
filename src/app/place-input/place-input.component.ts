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
  public place$: Subject<Place>;
  public value: string = '';
  public autocompletePlaces$ = new Observable<any[]>();
  public showLatLongInput = false;
  public textInputFormControl = new FormControl()

  constructor() {
    this.place = Wellington;
    this.place$ = new Subject<Place>();
    this.textInputFormControl.setValue(this.place.name);
  }

  ngOnInit(): void {
    this.place = this.copyPlace(Wellington);
    this.place$.next(this.copyPlace(this.place));

    this.setToStartingPosition();

    this.autocompletePlaces$ = this.textInputFormControl.valueChanges.pipe(
      map(value => ['A', 'Set', 'Of', 'Test', 'Values'].slice(value.length))
    )
  }

  public setToStartingPosition(): void {
    if (!navigator.geolocation) {
      console.log("Your browser is too old to share your location :'(");
      this.place = Wellington;
      this.place$.next(this.copyPlace(this.place));
      return;
    }

    // Get User's Location
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        this.place = { latitude: position.coords.latitude, longitude: position.coords.longitude, name: 'Your location' }
        this.place$.next(this.copyPlace(this.place));
      },
      (error) => {
        console.log('Position not given', error.message)
        // this.place = this.copyPlace(Wellington);
        // this.place$.next(this.copyPlace(this.place));
      }
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
