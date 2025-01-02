import { Injectable } from '@angular/core';
import { bindCallback, Observable } from 'rxjs';
import { GetDetailsObservable, GetQueryPredictionsObservable, PlaceDetailsResponse, QueryAutocompletionResponse } from 'src/app/types/google-maps.types';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private autoCompService!: google.maps.places.AutocompleteService;
  private placesService!: google.maps.places.PlacesService;
  private getAutoCompQueryPredictionsFunc!: GetQueryPredictionsObservable;
  private getPlaceDetailsFunc!: GetDetailsObservable;


  public initService(): void {
    this.autoCompService = new google.maps.places.AutocompleteService();
    const map = new google.maps.Map(document.createElement('div'));
    this.placesService = new google.maps.places.PlacesService(map);

    let getQueryPredictionsBoundScope = this.autoCompService.getQueryPredictions.bind(this.autoCompService)
    this.getAutoCompQueryPredictionsFunc = bindCallback(getQueryPredictionsBoundScope);

    let getDetailsBoundScope = this.placesService.getDetails.bind(this.placesService);
    this.getPlaceDetailsFunc = bindCallback(getDetailsBoundScope);
  }

  public getAutoCompQueyPredictions(text: string): Observable<QueryAutocompletionResponse> {
    if (!this.dependanciesReady())
      throw new Error('Google Maps API not loaded');

    return this.getAutoCompQueryPredictionsFunc({ input: text });
  }

  public getPlaceDetails(placeId: string): Observable<PlaceDetailsResponse> {
    if (!this.dependanciesReady())
      throw new Error('Google Maps API not loaded');

    return this.getPlaceDetailsFunc({ placeId: placeId, fields: ['name', 'formatted_address', 'geometry', 'utc_offset_minutes' ] })
  }

  private dependanciesReady(): boolean {
    if (!this.autoCompService || !this.placesService)
      if (!google)
        return false;
      else
        this.initService();
    return true;
  }
}
