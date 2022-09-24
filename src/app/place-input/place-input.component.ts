import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, switchMap, tap, filter, debounceTime, combineLatest, merge } from 'rxjs';
import { ClearSuggestionsAction, GetSuggestionsFromApiAction } from '../state/day.actions';
import { selectSuggestedLocations } from '../state/day.selectors';
import { StoreState } from '../state/day.state';
import { Place, Wellington } from '../types/place.type';
import { GoogleMapsService } from './google-maps/google-maps.service';


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
  public textInputFormControl = new FormControl();
  public displayAutocomplete = true;

  constructor(
    // private mapsService: GoogleMapsService,
    // private cdRef: ChangeDetectorRef
    private store: Store
  ) {
    this.place = Wellington;
    this.place$ = new Subject<Place>();
    this.textInputFormControl.setValue(this.place.name);
  }

  ngOnInit(): void {
    this.place = this.copyPlace(Wellington);
    this.place$.next(this.copyPlace(this.place));

    this.setToStartingPosition();

    // Send API Query
    this.textInputFormControl.valueChanges.pipe(
      filter(value => !!value),
      debounceTime(200),
      tap(value => this.store.dispatch(GetSuggestionsFromApiAction({ searchTerm: value})))
    ).subscribe();

    // Display suggestions
    // this.autocompletePlaces$ = this.store.select(selectSuggestedLocations).pipe(
    //   filter((item: any) => !!item.item),
    //   map((item: any) => item.item),
    //   tap(thing => console.log(thing))
    // )

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
      this.place$.next(this.copyPlace(this.place));
      return;
    }

    // Get User's Location
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      this.place = { latitude: position.coords.latitude, longitude: position.coords.longitude, name: 'Your location' }
      this.place$.next(this.copyPlace(this.place));
      this.store.dispatch(ClearSuggestionsAction());
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
