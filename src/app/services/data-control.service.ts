import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment.development';

export const LOCAL_STORAGE_TOKEN_KEY = 'accessToken';
export const LOCAL_STORAGE_ALL_COUNTRIES_KEY = 'allCountries'
export const LOCAL_STORAGE_STATE_KEY = 'states-of-'
export const LOCAL_STORAGE_CITY_KEY = 'cities-of-'
export const LOCAL_STORAGE_PRAYER_KEY = '-prayer-info-of-'
export const LOCAL_STORAGE_CONTENT_KEY = 'daily-content-'
export const LOCAL_STORAGE_ALL_CITIES_KEY = 'allCities'

@Injectable({
  providedIn: 'root'
})
export class DataControlService {

  // This service gets, sets and controls the required data 

  public allCountries: any[] = [];
  public allCities: any[] = [];
  public statesOfSelectedCountry: any[] = [];
  public citiesOfSelectedState: any[] = [];
  public prayerInfo: any[] = [];
  public dailyContent: any;

  constructor(private _httpRequestService: HttpRequestService, private _auth: AuthService) { }

  async appInitialization() {
    // checks if there is a token in localstorage when app is initializing. If there is no token gets a token from API
    const tokenFromLS = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (tokenFromLS === null) {
      await this._auth.getToken(environment.diyanetApi.userInfo).toPromise();
    }

    // checks if there is country info in localstorage when app initializing. If there is no country info gets a all countries from API
    const countriesFromLS = localStorage.getItem(LOCAL_STORAGE_ALL_COUNTRIES_KEY);
    if (countriesFromLS) {
      const parsedValue = JSON.parse(countriesFromLS);
      this.allCountries = parsedValue.data;
    } else {
      try {
        const countries = await this._httpRequestService.allCountriesRequest().toPromise()
        const stringifiedValue = JSON.stringify(countries);
        localStorage.setItem(LOCAL_STORAGE_ALL_COUNTRIES_KEY, stringifiedValue);
        this.allCountries = countries.data;
      } catch (error) {
        console.error(error);
      }
    }

    // checks if there is city info in localstorage when app initializing. If there is no city info gets a all cities from API
    const citiesFromLS = localStorage.getItem(LOCAL_STORAGE_ALL_CITIES_KEY);
    if (citiesFromLS) {
      const parsedValue = JSON.parse(citiesFromLS);
      this.allCities = parsedValue.data;
    } else {
      try {
        const cities = await this._httpRequestService.allCitiesRequest().toPromise();
        const stringifiedValue = JSON.stringify(cities);
        localStorage.setItem(LOCAL_STORAGE_ALL_CITIES_KEY, stringifiedValue);
        this.allCities = cities.data;
      } catch (error) {
        console.error(error);
      }
    }

    // checks if there is daily content data into LS with given day number and if there isn't fetches the data from API service
    const dayNumber = this.getTheDayOfTheYear();
    const dailyContentFromLS = localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY + dayNumber)
    if (dailyContentFromLS) {
      const parsedValue = JSON.parse(dailyContentFromLS);
      this.dailyContent = parsedValue.data;
    } else {
      try {
        const dailyContent = await this._httpRequestService.getDailyContent().toPromise();
        const stringifiedValue = JSON.stringify(dailyContent);
        localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY + dailyContent.data.dayOfYear, stringifiedValue);
        this.dailyContent = dailyContent.data;
      } catch (error) {
        console.error(error);
      }
    }
  }

  // checks if there is state info for given id and according to existence of the info gets it from LS or makes a request to API service and sets LS
  async getTheStatesOfTheSelectedCountry(id: number) {
    const statesFromLS = localStorage.getItem(LOCAL_STORAGE_STATE_KEY + id);
    if (statesFromLS) {
      const parsedValue = JSON.parse(statesFromLS)
      this.statesOfSelectedCountry = parsedValue.data
    } else {
      try {
        const states = await this._httpRequestService.statesOfACountryRequest(id).toPromise();
        const stringifiedValue = JSON.stringify(states)
        localStorage.setItem(LOCAL_STORAGE_STATE_KEY + id, stringifiedValue);
        this.statesOfSelectedCountry = states.data
      } catch (error) {
        console.error(error);
      }
    }
  }

  // checks if there is city info for given id and according to existence of the info gets it from LS or makes a request to API service and sets LS
  async getTheCitiesOfTheSelectedState(id: number) {
    const citiesFromLS = localStorage.getItem(LOCAL_STORAGE_CITY_KEY + id);
    if (citiesFromLS) {
      const parsedValue = JSON.parse(citiesFromLS)
      this.citiesOfSelectedState = parsedValue.data
    } else {
      try {
        const cities = await this._httpRequestService.citiesOfAStateRequest(id).toPromise();
        const stringifiedValue = JSON.stringify(cities)
        localStorage.setItem(LOCAL_STORAGE_CITY_KEY + id, stringifiedValue);
        this.citiesOfSelectedState = cities.data
      } catch (error) {
        console.error(error);
      }
    }
  }

  // checks if there is prayer info for given id and according to existence of the info gets it from LS or makes a request to API service and sets LS
  async getPrayerInfo(id: number) {
    const dayNumber = this.getTheDayOfTheYear();
    const prayerInfoFromLS = localStorage.getItem(id + LOCAL_STORAGE_PRAYER_KEY + dayNumber);
    if (prayerInfoFromLS) {
      const parsedValue = JSON.parse(prayerInfoFromLS);
      this.prayerInfo = parsedValue.data;
    } else {
      try {
        const prayerInfo = await this._httpRequestService.getPrayerInfo(id).toPromise();
        const stringifiedValue = JSON.stringify(prayerInfo);
        localStorage.setItem(id + LOCAL_STORAGE_PRAYER_KEY + dayNumber, stringifiedValue);
        this.prayerInfo = prayerInfo.data;
      } catch (error) {
        console.error(error);
      }
    }
  }

  // calculates and returns the number of day. For instance for february 5th returns 36
  getTheDayOfTheYear() {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 0);
    const ms1 = currentDate.getTime();
    const ms2 = startOfYear.getTime();
    return Math.floor((ms1 - ms2) / 86400000);
  }
}
