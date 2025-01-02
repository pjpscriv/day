import { createFeatureSelector } from "@ngrx/store";
import { Place } from "../types/place.types";
import { SuggestedLocationsStoreType } from "./day.state";

export const selectSuggestedLocations = createFeatureSelector<SuggestedLocationsStoreType>("suggestedLocations")
export const selectTime = createFeatureSelector<Date>("time")
export const selectPlace = createFeatureSelector<Place>("place")
