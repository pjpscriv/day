import { createAction, props } from "@ngrx/store";
import { Place } from '../types/place.type';

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
    UPDATE_TIME_ACTION               = '[Time] Update',
    UPDATE_PLACE_ACTION              = '[Place] Update'
}

// Suggestions
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


// Place (Coordinates)
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


// Time
export const UpdateTimeAction = createAction(
    DayActionTypes.UPDATE_TIME_ACTION,
    props<{ time: Date }>()
)


// Place
export const UpdatePlaceAction = createAction(
  DayActionTypes.UPDATE_PLACE_ACTION,
  props<{ place: Place }>()
)
