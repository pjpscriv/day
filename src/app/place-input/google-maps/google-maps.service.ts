import { Injectable } from '@angular/core';
import { bindCallback, Observable, of } from 'rxjs';

declare let google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  private loaded = false;
  private service: any;
  private getRecsFunc: ((input: any) => Observable<any>) | any;

  public initService(): any {
    this.service = new google.maps.places.AutocompleteService();
    let getQueryPredictionsBoundScope = this.service.getQueryPredictions.bind(this.service)
    this.getRecsFunc = bindCallback(getQueryPredictionsBoundScope);
  }

  // TODO: add types
  public getRecommendations(text: string): Observable<any> {

    console.log(`Req: ${text}`);

    if (!this.service)
      if (!google)
        return of(null);
      else
        this.initService();

    return this.getRecsFunc({ input: text });
  }

  public getLocationInformation(id: string): any {

  }
}
