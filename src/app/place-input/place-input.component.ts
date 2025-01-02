import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, delay, filter, map, merge, Observable, shareReplay, tap } from 'rxjs';
import {
  ClearSuggestionsAction,
  GetCoordinatesFromApiAction,
  GetSuggestionsFromApiAction,
  UpdateFirstLoadPlaceIdAction,
  UpdatePlaceAction,
  UpdateSuggestionsAction,
  UpdateTimeAction
} from '../state/day.actions';
import { selectPlace, selectSuggestedLocations } from '../state/day.selectors';
import { Place, Wellington, DefaultPlace } from '../types/place.types';
import { SuggestedLocationsStoreType } from '../state/day.state';
import { QueryAutocompletePrediction } from '../types/google-maps.types';
import { mostPopulatedCities } from '../types/suggested-locations.types';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { PARAM_NAMES } from '../day.consts';

const TEXT_BOX_MIN_WIDTH = 145;

@Component({
  selector: 'place-input',
  templateUrl: './place-input.component.html',
  styleUrls: ['./place-input.component.scss']
})
export class PlaceInputComponent implements OnInit {
  @ViewChild('placeNameInput') nameInput!: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteInput!: MatAutocompleteTrigger;

  private place!: Place;
  private oldValue?: QueryAutocompletePrediction = undefined;
  public value: string = '';
  public autocompletePlaces$ = new Observable<QueryAutocompletePrediction[]>();
  public showLatLongInput = false;
  public textInputFormControl = new FormControl();

  public place$: Observable<Place>;
  public inputWidth$ = new Observable<string>();

  constructor(
    private store: Store
  ) {
    this.place = DefaultPlace;
    this.place$ = this.store.select(selectPlace);
  }

  public ngOnInit(): void {
    const placeIdParam = new URLSearchParams(window.location.search).get(PARAM_NAMES.PLACE_ID);
    if (!!placeIdParam) {
      this.store.dispatch(UpdateFirstLoadPlaceIdAction({ placeId: placeIdParam }));
    } else {
      this.setToStartingPosition();
    }

    // Send API Query
    this.textInputFormControl.valueChanges.pipe(
      filter(value => !!value && typeof value === 'string'),
      debounceTime(300)
    ).subscribe(searchTerm => {
      this.store.dispatch(GetSuggestionsFromApiAction({ searchTerm }))
    });

    const suggestedLocations$ = this.store.select(selectSuggestedLocations).pipe(
      shareReplay()
    );

    this.autocompletePlaces$ = suggestedLocations$.pipe(
      delay(40),
      map((value) => {
        if (!!this.autocompleteInput)
          this.autocompleteInput.updatePosition();
        return (!!value?.item) ? value.item : [];
      })
    )

    this.inputWidth$ = combineLatest([this.place$, suggestedLocations$]).pipe(
      filter(([p, s]: [Place, SuggestedLocationsStoreType]) => !!p.name || s.item?.length > 0),
      map(([plce, suggs]: [Place, SuggestedLocationsStoreType]) => {
        const placeWidth = this.hackGetTextWidth(plce.name);
        const suggestionWidths = suggs.item?.map(s => this.hackGetTextWidth(s.description)) || [];
        const width = Math.max(placeWidth, ...suggestionWidths, TEXT_BOX_MIN_WIDTH);
        return `${width}px`;
      })
    )
  }

  public setToStartingPosition(): void {
    this.oldValue = undefined;

    // TODO: Could probable shift this stuff into NgRx
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
    this.store.dispatch(UpdateSuggestionsAction({ suggestions: mostPopulatedCities }));
  }

  public onLocationSelected(event: any): void {
    // console.log('onLocationSelected');
    this.oldValue = undefined;
    const value = event.option.value as QueryAutocompletePrediction;
    const props = {
      placeId: value.place_id as string,
      placeName: value.description as string
    }
    this.store.dispatch(GetCoordinatesFromApiAction(props));
    this.store.dispatch(ClearSuggestionsAction());

    setTimeout(() => {
      this.nameInput.nativeElement.blur();
    }, 200);
  }

  public reset() {
    this.setToStartingPosition();
    this.store.dispatch(UpdateTimeAction({ time: new Date() }));
  }

  public getDescription(option: any) {
    return option?.description;
  }

  public onDropdownOpen(): void {
    console.log('onDropdownOpen');
    this.autocompleteInput.openPanel();

    setTimeout(() => {
      this.autocompleteInput.updatePosition();
      this.autocompleteInput.openPanel();
    }, 30);
  }

  public onFocus(): void {
    // console.log('onFocus');
    let value = this.textInputFormControl.value;
    if (value === null) {
      value = { description: this.place.name };
    }
    if (!!value) { // && typeof value === 'string') {
      this.oldValue = value;
    }
    this.textInputFormControl.setValue('');
  }

  public onBlur(): void {
    // console.log('onBlur');
    setTimeout(() => {
      if (!!this.oldValue) {
        this.textInputFormControl.setValue(this.oldValue);
      }
    }, 100);
  }

  private hackGetTextWidth(text: string): number {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.font = "14px Roboto";
    var width = ctx.measureText(text).width;
    canvas.remove();
    // text width + padding + clear button + dropdown button + margin + extra for luck
    return width + 16 + 24 + 24 + 10 + 16
  }
}
