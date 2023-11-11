import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, filter, map, merge, Observable, tap } from 'rxjs';
import {
  ClearSuggestionsAction,
  GetCoordinatesFromApiAction,
  GetSuggestionsFromApiAction,
  UpdatePlaceAction,
  UpdateTimeAction
} from '../state/day.actions';
import { selectPlace, selectSuggestedLocations } from '../state/day.selectors';
import { Place, Wellington } from '../types/place.type';


@Component({
  selector: 'place-input',
  templateUrl: './place-input.component.html',
  styleUrls: ['./place-input.component.scss']
})
export class PlaceInputComponent implements OnInit {
  private place: Place;
  public value: string = '';
  public autocompletePlaces$ = new Observable<any[]>();
  public showLatLongInput = false;
  public textInputFormControl = new FormControl();
  public displayAutocomplete = true;

  public place$: Observable<Place>;

  constructor(
    private store: Store
  ) {
    this.place = Wellington;
    // this.textInputFormControl.setValue(this.place.name);

    this.place$ = this.store.select(selectPlace) as Observable<Place>;
  }

  ngOnInit(): void {
    this.place = this.copyPlace(Wellington);
    this.store.dispatch(UpdatePlaceAction({ place: this.place }))

    this.setToStartingPosition();

    // Send API Query
    this.textInputFormControl.valueChanges.pipe(
      filter(value => !!value),
      debounceTime(200),
      tap(value => this.store.dispatch(GetSuggestionsFromApiAction({ searchTerm: value})))
    ).subscribe();

    this.autocompletePlaces$ = merge(
      this.textInputFormControl.valueChanges,
      this.store.select(selectSuggestedLocations)
    ).pipe(
      map((value: any) => {
        return (!!value?.item) ? value.item : [];
      })
    )
  }

  public setToStartingPosition(): void {
    if (!navigator.geolocation) {
      console.log("Your browser is too old to share your location :'(");
      this.place = Wellington;
      this.store.dispatch(UpdatePlaceAction({ place: this.place }))

      return;
    }

    // Get User's Location
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(`User's location:`);
      console.log(position);
      this.place = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        name: 'Your location'
      }
      this.store.dispatch(UpdatePlaceAction({ place: this.place }))
      this.store.dispatch(ClearSuggestionsAction());
    },
      (error) => {
        console.log('Position not given', error.message)
      }
    );
  }

  public onLatChange(event: any): void {
    const newLatitude = +event?.target?.value;
    const newPlace = {
      ...this.place,
      latitude: newLatitude
    }
    this.place = newPlace;
    this.store.dispatch(UpdatePlaceAction({ place: newPlace }))
  }

  public onLongChange(event: any): void {
    const newLongitude = +event?.target?.value;
    const newPlace = {
      ...this.place,
      longitude: newLongitude
    }
    this.place = newPlace;
    this.store.dispatch(UpdatePlaceAction({ place: newPlace }))
  }

  public toggleInputType(): void {
    this.showLatLongInput = !this.showLatLongInput;
  }

  public onLocationSelected(event: any): void {
    const thing = event.option.value;
    this.store.dispatch(GetCoordinatesFromApiAction({ placeId: thing.place_id }))
  }

  public reset() {
    this.setToStartingPosition();
    this.store.dispatch(UpdateTimeAction({ time: new Date() }));
  }

  public getDescription(option: any) {
    return option?.description;
  }

  private copyPlace(place: Place): Place {
    return {
      latitude: place.latitude,
      longitude: place.longitude,
      name: place.name
    }
  }
}
