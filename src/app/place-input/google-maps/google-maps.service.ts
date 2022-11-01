import { Injectable } from '@angular/core';
import { bindCallback, Observable, of, throwError } from 'rxjs';

declare let google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private autoCompService: any;
  private placesService: any;
  private getRecsFunc: ((input: any) => Observable<any>) | any;
  private getLocFunc: ((input: any) => Observable<any>) | any;


  public initService(): any {
    this.autoCompService = new google.maps.places.AutocompleteService();
    const map = new google.maps.Map(document.createElement('div'));
    this.placesService = new google.maps.places.PlacesService(map);

    let getQueryPredictionsBoundScope = this.autoCompService.getQueryPredictions.bind(this.autoCompService)
    this.getRecsFunc = bindCallback(getQueryPredictionsBoundScope);

    let getDetailsBoundScope = this.placesService.getDetails.bind(this.placesService);
    this.getLocFunc = bindCallback(getDetailsBoundScope);
  }

  // TODO: add types
  public getRecommendations(text: string): Observable<any> {
    if (!this.dependanciesReady())
      return of(null);

    console.log(`Get Recs: ${text}`);
    return this.getRecsFunc({ input: text });
  }

  public getLocationInformation(placeId: string): Observable<any> {
    if (!this.dependanciesReady())
      return of(null);

    console.log(`Get Deets: ${placeId}`)
    return this.getLocFunc({ placeId: placeId, fields: ['name', 'geometry'] })
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
