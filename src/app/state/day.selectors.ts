import { createFeatureSelector } from "@ngrx/store";

export const selectSuggestedLocations = createFeatureSelector("suggestedLocations")
export const selectTime = createFeatureSelector("time")
export const selectPlace = createFeatureSelector("place")
