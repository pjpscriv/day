import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, combineLatest, map, of, switchMap, tap } from "rxjs";
import { GoogleMapsService } from "../place-input/google-maps/google-maps.service";
import {
    GetCoordinatesFromApiAction,
    GetCoordinatesFromApiFailureAction,
    GetCoordinatesFromApiSuccessAction,
    GetSuggestionsFromApiAction,
    GetSuggestionsFromApiFailureAction,
    GetSuggestionsFromApiSuccessAction
} from "./day.actions";

@Injectable({
    providedIn: 'root'
})
export class DayEffects {

    constructor(
        private actions$: Actions,
        private mapsService: GoogleMapsService
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
            of(action.placeName)
        ])),
        map(([resp, name]) => GetCoordinatesFromApiSuccessAction({ response: resp[0], name: name })),
        catchError(error => of(GetSuggestionsFromApiFailureAction({ errorMessage: error })))
    ));
}
