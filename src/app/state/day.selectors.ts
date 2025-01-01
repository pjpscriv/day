import { createFeatureSelector } from "@ngrx/store";
import { Place } from "../types/place.type";
import { StoreState } from "./day.state";
import { QueryAutocompletePrediction } from "../types/google-maps.type";

export const selectSuggestedLocations = createFeatureSelector<StoreState<QueryAutocompletePrediction[]>>("suggestedLocations")
export const selectTime = createFeatureSelector<Date>("time")
export const selectPlace = createFeatureSelector<Place>("place")
