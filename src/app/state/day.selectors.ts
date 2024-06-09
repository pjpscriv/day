import { createFeatureSelector } from "@ngrx/store";
import { Place } from "../types/place.type";

export const selectSuggestedLocations = createFeatureSelector<any[]>("suggestedLocations")
export const selectTime = createFeatureSelector<Date>("time")
export const selectPlace = createFeatureSelector<Place>("place")
