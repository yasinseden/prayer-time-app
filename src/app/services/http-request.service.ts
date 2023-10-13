import { HttpClient, HttpContext, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

import { TOKEN_REQUEST_HTTP_CONTEXT_TOKEN } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor(private _http: HttpClient) {}

  findCurrentLocationRequest(lat: any, lon: any) {
    return this._http.get<any>(environment.locationApi.url + '&lat=' + lat + '&lon=' + lon + '&format=json', { context: new HttpContext().set(TOKEN_REQUEST_HTTP_CONTEXT_TOKEN, true) })
  }

  getDailyContent() {
    return this._http.get<any>(environment.diyanetApi.endPoints.dailyContent)
  }

  allCountriesRequest() {
    return this._http.get<any>(environment.diyanetApi.endPoints.countries)
  }

  allCitiesRequest() {
    return this._http.get<any>(environment.diyanetApi.endPoints.cities)
  }

  statesOfACountryRequest(id: number) {
    return this._http.get<any>(environment.diyanetApi.endPoints.statesOfACountry + id)
  }
  
  citiesOfAStateRequest(id: number) {
    return this._http.get<any>(environment.diyanetApi.endPoints.citiesOfAState + id)
  }

  getPrayerInfo(id: number) {
    return this._http.get<any>(environment.diyanetApi.endPoints.prayerTime + id)
  }
}
