import { Observable } from "rxjs";
import 'google.maps';

export type PlaceResult = google.maps.places.PlaceResult;
export type PlacesServiceStatus = google.maps.places.PlacesServiceStatus;
export type PlaceDetailsRequest = google.maps.places.PlaceDetailsRequest;
export type PlaceDetailsResponse = [a: PlaceResult | null, b: PlacesServiceStatus];
export type GetDetailsObservable = (request: PlaceDetailsRequest) => Observable<PlaceDetailsResponse>;

export type QueryAutocompletePrediction = google.maps.places.QueryAutocompletePrediction;
export type QueryAutocompletionRequest = google.maps.places.QueryAutocompletionRequest;
export type QueryAutocompletionResponse = [a: QueryAutocompletePrediction[] | null, b: PlacesServiceStatus ];
export type GetQueryPredictionsObservable = (request: QueryAutocompletionRequest) => Observable<QueryAutocompletionResponse>;
