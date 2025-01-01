import { createReducer, on } from "@ngrx/store";
import {
  ClearSuggestionsAction,
  GetCoordinatesFromApiSuccessAction,
  GetSuggestionsFromApiAction,
  GetSuggestionsFromApiFailureAction,
  GetSuggestionsFromApiSuccessAction,
  UpdatePlaceAction,
  UpdateSuggestionsAction,
  UpdateTimeAction
} from './day.actions';
import { initialState } from "./day.state";


export const suggestionsReducer = createReducer(
    initialState.suggestedLocations,
    on(GetSuggestionsFromApiAction, (item, _) => {
        return { ...item, isLoading: true, item: [] };
    }),
    on(GetSuggestionsFromApiSuccessAction, (item, { result }) => {
        return { ...item, isLoading: false, item: result ?? [] };
    }),
    on(GetSuggestionsFromApiFailureAction, (item, { errorMessage }) => {
        return { ...item, isLoading: false, error: errorMessage };
    }),
    on(UpdateSuggestionsAction, (_, { suggestions }) => {
        return { isLoading: false, item: suggestions };
    }),
    on(ClearSuggestionsAction, (_) => {
        return initialState.suggestedLocations;
    })
);

export const placeReducer = createReducer(
    initialState.place,
    on(GetCoordinatesFromApiSuccessAction, (item, { response, name }) => {
        if (!response?.geometry?.location || !response.utc_offset_minutes) {
            console.error('Insufficient data returned from Google Maps API', response);
            return item;
        }
        
        return {
            name: name,
            latitude: response.geometry.location.lat(),
            longitude: response.geometry.location.lng(),
            utcOffset: response.utc_offset_minutes
        };
    }),
    on(UpdatePlaceAction, (_, { place }) => place)
);

export const timeReducer = createReducer(
    initialState.time,
    on(UpdateTimeAction, (_, { time}) => time)
);
