import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { LocationInfo } from '../interfaces/location-info-model';
import { DataControlService } from './data-control.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  public cityId: number = 0;
  // Dont forget to change latLon array
  public latLon: number[] = [48.7728252, 9.180014]

  constructor(private _httpRequestService: HttpRequestService, private _dataControl: DataControlService) { }

  async getLocation() {
    const coordinates = await this.getCoordinates();
    const locationInfo = this.setLocationInfo(this.latLon);
    this.cityId = this.filterCities((await locationInfo).city);
    return locationInfo
  }
  
  async getCoordinates(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lanLonArr = [position.coords.latitude, position.coords.longitude];
          resolve(lanLonArr);
        }, (error) => {
          reject(error);
        });
      } else {
        reject(new Error('Geolocation not available'));
      }
    });
  }

  async setLocationInfo(latLonArr: number[]) {
    let locationInfo = new LocationInfo(null, null, null)
    try {
      const loc = await this._httpRequestService.findCurrentLocationRequest(latLonArr[0], latLonArr[1]).toPromise();
      const address = loc.address;
      locationInfo.country = address.country;
      const lowerCasedCountry = address.country.toLowerCase()
      if (lowerCasedCountry === 'turkey' || lowerCasedCountry === 'turkiye') {
        locationInfo.state = address.province;
        locationInfo.city = address.town
      };
      locationInfo.state = address.state != null ? address.state : address.country;
      locationInfo.city = address.city != null ? address.city : address.town;
    } catch (error) {
      console.error(error);
    }
    return locationInfo;
  }

  filterCities(cityData: string | null): number {
    const citiesArr = this._dataControl.allCities;
    const filteredData = citiesArr.filter(city => city.code.toLowerCase() === cityData?.toLocaleLowerCase())
    if (filteredData.length > 0) {
      return filteredData[0].id;
    } else {
      return -1;
    }
  }
}