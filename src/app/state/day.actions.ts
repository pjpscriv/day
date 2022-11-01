import { createAction, props } from "@ngrx/store";

export enum DayActionTypes {
    GET_SUGGECTIONS                  = '[Suggections] Get',
    GET_SUGGECTIONS_FROM_API         = '[Suggections] Get From API',
    GET_SUGGECTIONS_FROM_API_SUCCESS = '[Suggections] Get From API Success',
    GET_SUGGECTIONS_FROM_API_FAILURE = '[Suggections] Get From API Failure',
    CLEAR_SUGGECTIONS                = '[Suggections] Clear',
    GET_COORDINATES                  = '[Coordinates] Get',
    GET_COORDINATES_FROM_API         = '[Coordinates] Get From API',
    GET_COORDINATES_FROM_API_SUCCESS = '[Coordinates] Get From API Success',
    GET_COORDINATES_FROM_API_FAILURE = '[Coordinates] Get From API Failure',
}


export const GetSuggestionsFromApiAction = createAction(
    DayActionTypes.GET_SUGGECTIONS_FROM_API,
    props<{ searchTerm: string }>()
);

export const GetSuggestionsFromApiSuccessAction = createAction(
    DayActionTypes.GET_SUGGECTIONS_FROM_API_SUCCESS,
    props<{ result: any[] }>()
);

export const GetSuggestionsFromApiFailureAction = createAction(
    DayActionTypes.GET_SUGGECTIONS_FROM_API_SUCCESS,
    props<{ errorMessage: string }>()
);

export const ClearSuggestionsAction = createAction(
    DayActionTypes.CLEAR_SUGGECTIONS
);


export const GetCoordinatesAction = createAction(
    DayActionTypes.GET_COORDINATES,
    props<{ placeId: string }>()
);

export const GetCoordinatesFromApiAction = createAction(
    DayActionTypes.GET_COORDINATES_FROM_API,
    props<{ placeId: string }>()
);

export const GetCoordinatesFromApiSuccessAction = createAction(
    DayActionTypes.GET_COORDINATES_FROM_API_SUCCESS,
    props<{ response: any }>()
);

export const GetCoordinatesFromApiFailureAction = createAction(
    DayActionTypes.GET_COORDINATES_FROM_API_FAILURE,
    props<{ errorMessage: string }>()
);
