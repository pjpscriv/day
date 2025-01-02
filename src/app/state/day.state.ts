import { QueryAutocompletePrediction } from "../types/google-maps.types";
import { DefaultPlace, Place } from "../types/place.types";

export type StoreState<T> = {
    isLoading: boolean;
    item: T;
    error?: string;
}

export type SuggestedLocationsStoreType = StoreState<QueryAutocompletePrediction[]>;

export type DayState = {
    suggestedLocations: SuggestedLocationsStoreType;
    time: Date;
    place: Place;
}

export const initialSuggestedLocations = { isLoading: false, item: [] };
export const initialTime = new Date();

export const initialState: DayState = {
    suggestedLocations: initialSuggestedLocations,
    time: initialTime,
    place: DefaultPlace
}
