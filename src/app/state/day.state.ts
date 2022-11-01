import { DefaultPlace, Place } from "../types/place.type";

export type StoreState<T> = {
    isLoading: boolean;
    item: T;
    error?: string;
}

export type DayState = {
    suggestedLocations: StoreState<any[]>;
    time: Date;
    place: Place;
}

export const initialState: DayState = {
    suggestedLocations: { isLoading: false, item: [] },
    time: new Date(),
    place: DefaultPlace
}