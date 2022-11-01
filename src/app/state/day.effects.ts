import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
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
    ) { }

    public getSuggestionsFromApi$ = createEffect(() => this.actions$.pipe(
        ofType(GetSuggestionsFromApiAction),
        switchMap((action) => this.mapsService.getRecommendations(action.searchTerm).pipe(
            map(([result, status]) => GetSuggestionsFromApiSuccessAction({ result: (status === 'OK' ? result : []) })),
            catchError(error => of(GetSuggestionsFromApiFailureAction({ errorMessage: error })))
        )
        )
    ));

    public getCoordinatesFromApi$ = createEffect(() => this.actions$.pipe(
        ofType(GetCoordinatesFromApiAction),
        switchMap((action) => {
            const thing$ = this.mapsService.getLocationInformation(action.placeId)

            return thing$;
        }



        //.pipe(
        //     tap(x => {
        //         let thing = x;
        //         console.log(`RESP: ${x}`)
        //     }),
        //     map((result) => GetCoordinatesFromApiSuccessAction(result)),
        //     catchError(error => of(GetCoordinatesFromApiFailureAction({ errorMessage: error })))
        // )
        ),
        tap(x => {
            console.log(`RESP 2: ${x}`);
        }),
        map(([result, status]) => GetCoordinatesFromApiSuccessAction({ response: result })),
        catchError(error => of(GetSuggestionsFromApiFailureAction({ errorMessage: error })))
    ));
}
