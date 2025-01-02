import { createReducer, on } from "@ngrx/store";
import {
  ClearSuggestionsAction,
  GetCoordinatesFromApiAction,
  GetCoordinatesFromApiSuccessAction,
  GetSuggestionsFromApiAction,
  GetSuggestionsFromApiFailureAction,
  GetSuggestionsFromApiSuccessAction,
  UpdateFirstLoadPlaceIdAction,
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
    on(UpdatePlaceAction, (_, { place }) => place)
);

export const timeReducer = createReducer(
    initialState.time,
    on(UpdateTimeAction, (_, { time}) => time)
);

export const firstLoadPlaceIdReducer = createReducer(
    initialState.firstLoadPlaceId,
    on(UpdateFirstLoadPlaceIdAction, (_, { placeId }) => placeId),
    // After first load, set slice to undefined
    on(GetCoordinatesFromApiAction, (_, a) => undefined)
);
