import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, filter, map, merge, Observable, tap } from 'rxjs';
import {
  ClearSuggestionsAction,
  GetCoordinatesFromApiAction,
  GetSuggestionsFromApiAction,
  UpdatePlaceAction,
  UpdateSuggestionsAction,
  UpdateTimeAction
} from '../state/day.actions';
import { selectPlace, selectSuggestedLocations } from '../state/day.selectors';
import { Place, Wellington, DefaultPlace } from '../types/place.type';
import { mostPopulatedCities, StoreState } from '../state/day.state';
import { QueryAutocompletePrediction } from '../types/google-maps.type';


@Component({
  selector: 'place-input',
  templateUrl: './place-input.component.html',
  styleUrls: ['./place-input.component.scss']
})
export class PlaceInputComponent implements OnInit {
  private place!: Place;
  private oldValue?: QueryAutocompletePrediction = undefined;
  public value: string = '';
  public autocompletePlaces$ = new Observable<QueryAutocompletePrediction[]>();
  public showLatLongInput = false;
  public textInputFormControl = new FormControl();

  public place$: Observable<Place>;

  constructor(
    private store: Store
  ) {
    this.place = DefaultPlace;
    this.place$ = this.store.select(selectPlace);
  }

  public ngOnInit(): void {
    this.setToStartingPosition();

    // Send API Query
    this.textInputFormControl.valueChanges.pipe(
      filter(value => !!value && typeof value === 'string'),
      debounceTime(200)
    ).subscribe(searchTerm => {
      this.store.dispatch(GetSuggestionsFromApiAction({ searchTerm }))
  });

    this.autocompletePlaces$ = merge(
      // this.textInputFormControl.valueChanges,
      this.store.select(selectSuggestedLocations)
    ).pipe(
      map((value: StoreState<QueryAutocompletePrediction[]>) => {
        return (!!value?.item) ? value.item : [];
      })
    )
  }

  public setToStartingPosition(): void {
    this.oldValue = undefined;
    if (!navigator.geolocation) {
      console.log("Your browser is too old to share your location :'(");
      this.place = Wellington;
      this.store.dispatch(UpdatePlaceAction({ place: this.place }))
      return;
    }

    // Get User's Location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log(`User's location:`, position);
        this.place = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: 'Your location',
          utcOffset: new Date().getTimezoneOffset() * -1
        }
        this.store.dispatch(UpdatePlaceAction({ place: this.place }))
        this.store.dispatch(ClearSuggestionsAction());
      },
      (error) => {
        console.log('Position not given', error.message);
        this.place = Wellington; 
        this.store.dispatch(UpdatePlaceAction({ place: this.place }));
        this.store.dispatch(ClearSuggestionsAction());
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

  public onDropdownClick(event: any): void {
    // event.stopPropagation;
    // event.preventDefault;
    // console.log('Dropdown clicked');
    // console.log(event);
    this.store.dispatch(UpdateSuggestionsAction({ suggestions: mostPopulatedCities }));
  }

  public onLocationSelected(event: any): void {
    this.oldValue = undefined;
    const value = event.option.value as QueryAutocompletePrediction;
    const props = {
      placeId: value.place_id as string,
      placeName: value.description as string
    }
    this.store.dispatch(GetCoordinatesFromApiAction(props))
  }

  public reset() {
    this.setToStartingPosition();
    this.store.dispatch(UpdateTimeAction({ time: new Date() }));
  }

  public getDescription(option: any) {
    return option?.description;
  }

  public onFocus(): void {
    let value = this.textInputFormControl.value;
    if (value === null) {
      value = { description: this.place.name };
    }
    if (!!value) { // && typeof value === 'string') {
      this.oldValue = value;
    }
    this.textInputFormControl.setValue('');
    // this.store.dispatch(ClearSuggestionsAction());
  }

  public onBlur(): void {
    setTimeout(() => {
      if (!!this.oldValue) {
        this.textInputFormControl.setValue(this.oldValue);
      }
      // this.store.dispatch(ClearSuggestionsAction());
    }, 100);
  }
}
