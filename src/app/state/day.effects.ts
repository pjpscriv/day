import { Injectable, NgZone } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, combineLatest, debounceTime, filter, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { GoogleMapsService } from "../place-input/google-maps/google-maps.service";
import {
    GetCoordinatesFromApiAction,
    GetCoordinatesFromApiFailureAction,
    GetCoordinatesFromApiSuccessAction,
    GetSuggestionsFromApiAction,
    GetSuggestionsFromApiFailureAction,
    GetSuggestionsFromApiSuccessAction,
    GoogleMapsLoadedAction,
    UpdatePlaceAction,
    UpdateTimeAction
} from "./day.actions";
import { Router } from "@angular/router";
import { PARAM_NAMES } from "../day.consts";
import * as moment from 'moment';
import { Place } from "../types/place.types";
import { Store } from "@ngrx/store";
import { selectFirstLoadPlaceId } from "./day.selectors";

@Injectable({
    providedIn: 'root'
})
export class DayEffects {

    constructor(
        private store: Store,
        private actions$: Actions,
        private mapsService: GoogleMapsService,
        private router: Router,
        private ngZone: NgZone
    ) {}

    public getSuggestionsFromApi$ = createEffect(() => this.actions$.pipe(
        ofType(GetSuggestionsFromApiAction),
        switchMap((action) => this.mapsService.getAutoCompQueyPredictions(action.searchTerm).pipe(
            map(([result, status]) => GetSuggestionsFromApiSuccessAction({ result: (status === 'OK' ? result : []) })),
            catchError(error => of(GetSuggestionsFromApiFailureAction({ errorMessage: error })))
        )
        )
    ));

    public getCoordinatesFromApi$ = createEffect(() => this.actions$.pipe(
        ofType(GetCoordinatesFromApiAction),
        switchMap((action) => combineLatest([
            this.mapsService.getPlaceDetails(action.placeId),
            of(action)
        ])),
        map(([resp, actn]) => GetCoordinatesFromApiSuccessAction({ response: resp[0], name: actn.placeName, id: actn.placeId })),
        catchError(error => of(GetCoordinatesFromApiFailureAction({ error: error })))
    ));

    public getCoordinatesFromApiSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(GetCoordinatesFromApiSuccessAction),
        filter(a => {
            const invalid = !a.response?.geometry?.location || !a.response.utc_offset_minutes || !a.response.name;
            if (invalid)
                console.error('Insufficient data returned from Google Maps API', a.response);
            return !invalid;
        }),
        map(action => {
            const { response, name, id } = action;
            const place: Place = {
                name: !!name ? name : response!.formatted_address!,
                latitude: response!.geometry!.location!.lat(),
                longitude: response!.geometry!.location!.lng(),
                utcOffset: response!.utc_offset_minutes!,
                placeId: id
            };
            return UpdatePlaceAction({ place });
        })
    ));

    public googleMapsLoaded$ = createEffect(() => this.actions$.pipe(
        ofType(GoogleMapsLoadedAction),
        withLatestFrom(this.store.select(selectFirstLoadPlaceId)),
        filter(([_, placeId]) => !!placeId),
        map(([_, placeId]) => GetCoordinatesFromApiAction({ placeId, placeName: '' }))
    ));


    // Param update effects
    public updatePlace$ = createEffect(() => this.actions$.pipe(
        ofType(UpdatePlaceAction),
        tap(action => {
            this.ngZone.run(() => {
                const params = { [PARAM_NAMES.PLACE_ID]: action.place.placeId };
                this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
            });
        })
    ), { dispatch: false });

    public updateTime$ = createEffect(() => this.actions$.pipe(
        ofType(UpdateTimeAction),
        debounceTime(200),
        map(action => moment(action.time).format('YYYY-MM-DD')),
        tap(timeStr => {
            this.ngZone.run(() => {
                const today = moment().format('YYYY-MM-DD');
                const params = { [PARAM_NAMES.TIME]: timeStr === today ? null : timeStr };
                this.router.navigate(['.'], { queryParams: params, queryParamsHandling: 'merge' });
            });
        })
    ), { dispatch: false });


    // Errors - should use material snackbar
}
