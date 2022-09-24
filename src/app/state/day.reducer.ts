import { createReducer, on } from "@ngrx/store";
import { ClearSuggestionsAction, GetSuggestionsFromApiAction, GetSuggestionsFromApiFailureAction, GetSuggestionsFromApiSuccessAction } from "./day.actions";
import { initialState } from "./day.state";


export const suggestionsReducer = createReducer(
    initialState.suggestedLocations,
    on(GetSuggestionsFromApiAction, (item, _) => {
        return { ...item, isLoading: true, item: [] };
    }),
    on(GetSuggestionsFromApiSuccessAction, (item, { result }) => {
        return { ...item, isLoading: false, item: result };
    }),
    on(GetSuggestionsFromApiFailureAction, (item, { errorMessage }) => {
        return { ...item, isLoading: false, error: errorMessage };
    }),
    on(ClearSuggestionsAction, (_) => {
        return initialState.suggestedLocations;
    })
);

