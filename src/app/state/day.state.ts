
export type StoreState<T> = {
    isLoading: boolean;
    item: T;
    error?: string;
}

export type DayState = {
    suggestedLocations: StoreState<any[]>;
}

export const initialState: DayState = {
    suggestedLocations: { isLoading: false, item: [] }
}