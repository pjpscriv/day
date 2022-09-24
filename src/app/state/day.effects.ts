import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { GoogleMapsService } from "../place-input/google-maps/google-maps.service";
import { GetSuggestionsFromApiAction, GetSuggestionsFromApiFailureAction, GetSuggestionsFromApiSuccessAction } from "./day.actions";

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
        switchMap((action) => this.mapsService.getRecommendations(action.searchTerm).pipe(
                map(([result, status]) => GetSuggestionsFromApiSuccessAction({result: (status === 'OK' ? result : [])})),
                catchError(error => of(GetSuggestionsFromApiFailureAction({errorMessage: error})))
            )
        )
    ));
}
