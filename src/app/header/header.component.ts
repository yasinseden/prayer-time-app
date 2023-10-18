import { Component } from '@angular/core';
import { DataControlService } from '../services/data-control.service';
import { PrayerInfo } from '../interfaces/prayer-time-model';
import { ComponentCommunicationService } from '../services/component-communication.service';
import { LocationService } from '../services/location.service';
import { LocationInfo } from '../interfaces/location-info-model';
import { interval } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  public allCountries: any[] = [];
  public statesOfSelectedCountry: any[] = [];
  public citiesOfSelectedState: any[] = [];
  private prayerInfoOfSelectedCity: any[] = [];
  private selectedLocationInfo: LocationInfo = new LocationInfo(null, null, null)
  public bindedLocationInfo: string = 'Selected Location/Seçili Konum'
  public selectedValue: LocationInfo = new LocationInfo('defaultOption', 'defaultOption', 'defaultOption');
  private cityId: number = 0;
  public dataToRender: PrayerInfo | undefined = new PrayerInfo(this.selectedLocationInfo, this.prayerInfoOfSelectedCity[0])
  
  constructor(
    private _dataControl: DataControlService,
    private _componentCommunication: ComponentCommunicationService,
    private _locationService: LocationService
    ) {
      
      this.allCountries = _dataControl.allCountries;
      this.sortAlphabetically(this.allCountries);
    }
    
    ngOnInit(): void {
      
      // The code below tracks the time and when the current time equal to 00:00 it readjust the parayer time info of selected city
      const readjustTime = new Date();
      readjustTime.setHours(0, 0, 0, 0);
      const readjustTimeHourMin = readjustTime.toTimeString().slice(0, 5);
    
      interval(60000).subscribe(() => {
        const currentTime = new Date();
        const currentTimeHourMin = currentTime.toTimeString().slice(0, 5);
    
        if (currentTimeHourMin === readjustTimeHourMin) {
          this.setPrayerInfo();
        }
      })
    }
    
  async setStatesToSelectOptions(event: any): Promise<void> {
    const target = event.target;
    this.gatherSelectedLocation(target, 'country');
    const countryId = target.value;
    await this._dataControl.getTheStatesOfTheSelectedCountry(countryId);
    this.statesOfSelectedCountry = this._dataControl.statesOfSelectedCountry;
    this.sortAlphabetically(this.statesOfSelectedCountry)
  }

  public async setCitiesToSelectOptions(event: any): Promise<void> {
    const target = event.target;
    this.gatherSelectedLocation(target, 'state')
    const stateId = target.value;
    await this._dataControl.getTheCitiesOfTheSelectedState(stateId);
    this.citiesOfSelectedState = this._dataControl.citiesOfSelectedState;
    this.sortAlphabetically(this.citiesOfSelectedState)
  }

  public displaySelectedLocationIntoConfirmationField(event: any): void {
    const target = event.target;
    this.gatherSelectedLocation(target, 'city')
    this.cityId = target.value;
    this.bindedLocationInfo = `${this.selectedLocationInfo.city} ${this.selectedLocationInfo.state} ${this.selectedLocationInfo.country}`;
    // Time out is needed because of the city select element's default selected option isn't assigned after the method is executed even though the all values are assigned to the their fields of selectedValue
    setTimeout(() => {
      this.selectedValue = { country: 'defaultOption', state: 'defaultOption', city: 'defaultOption' };
    }, 50);
  }

  public async location(): Promise<void> {
    const locationInfo = await this._locationService.getLocation();
    this.cityId = this._locationService.cityId;

    if (this.cityId === -1) {
      this.locationCannotFindWarning();
    } else {
      this.selectedLocationInfo = locationInfo;
      this.bindedLocationInfo = `${this.selectedLocationInfo.city} ${this.selectedLocationInfo.state} ${this.selectedLocationInfo.country}`
    }
  }

  public async setPrayerInfo(): Promise<void> {
    if (this.bindedLocationInfo !== 'Selected Location/Seçili Konum') {
      await this._dataControl.getPrayerInfo(this.cityId);
      this.prayerInfoOfSelectedCity = this._dataControl.prayerInfo;
      if (this.dataToRender) {
        this.dataToRender.locationInfo = this.selectedLocationInfo;
        this.dataToRender.infoFromApi = this.prayerInfoOfSelectedCity[0];
      }
      this._componentCommunication.dataToRenderBehaviralObject.next(this.dataToRender);
    }
  }


  // ngOnInit(): void {
  //   const readjustTime = new Date();
  //   readjustTime.setHours(20, 0, 0, 0);

  //   interval(25000).subscribe(async () => {
  //     const currentTime = new Date();
  //     const readjustHour = readjustTime.getDate();
  //     const currentHour = currentTime.getDate();

  //     if (readjustHour === currentHour) {
  //       await this._dataControl.getPrayerInfo(1029);
  //       this.prayerInfoOfSelectedCity = this._dataControl.prayerInfo;
  //       if (this.dataToRender) {
  //         this.dataToRender.locationInfo.city = 'jabfkjbdkjng'
  //         this.dataToRender.infoFromApi = this.prayerInfoOfSelectedCity[0];
  //       }
  //       this._componentCommunication.dataToRenderBehaviralObject.next(this.dataToRender)
  //     }
  //   })
  // }

  // To gather selected location information
  private gatherSelectedLocation(target: any, field: string): void {
    const selectedIndex = target.selectedIndex;
    if (selectedIndex !== -1) {
      switch (field) {
        case 'country':
          this.selectedLocationInfo.country = target.options[selectedIndex].text
          break;
        case 'state':
          this.selectedLocationInfo.state = target.options[selectedIndex].text
          break
        case 'city':
          this.selectedLocationInfo.city = target.options[selectedIndex].text
          break
        default:
          break;
      }
    }
  }

  // The data from API is sorted according to the id. This method sorts the data alphabetically for a better UX
  private sortAlphabetically(arr: any[]): void {
    arr.sort((a, b) => a.code.localeCompare(b.code))
  }

  // The code below is used for warn the user when location connot find
  public transformWarning: string = 'translate(-50%, -110%)'

  private locationCannotFindWarning(): void {
    if (this.transformWarning === 'translate(-50%, -110%)') {
      this.transformWarning = 'translate(-50%, 0)'
      setTimeout(() => {
        this.transformWarning = 'translate(-50%, -110%)'
      }, 2000);
    }
  }
}
