import { Component } from '@angular/core';
import { ComponentCommunicationService } from '../services/component-communication.service';
import { Subscription, timer } from 'rxjs';
import { PrayerInfo } from '../interfaces/prayer-time-model';
import { DataControlService } from '../services/data-control.service';

export const LOCAL_STORAGE_FRIDAY_PRAY_KEY = 'friday-pray-key'

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent {

  public dataToRender: PrayerInfo | undefined;
  public prayerDataToForLoop: any;
  private dataToRenderSubscription: Subscription
  public currentDateTime = new Date();
  public dailyContent: any;
  public fieldsToDisplay: any[] = ['fajr', 'astronomicalSunrise', 'dhuhr', 'asr', 'maghrib', 'isha']
  public fieldNamesToDisplay: { [key: string]: string } = { fajr: 'Sabah-Fajr', astronomicalSunrise: 'Güneş', dhuhr: 'Öğle-Dhuhr', asr: 'İkindi-Asr', maghrib: 'Akşam-maghrib', isha: 'Yatsı-Isha' }
  public prayerTimePeriodKey: string | undefined = '';
  public mosqueDay: string = 'none'
  public mosqueNight: string = 'block'

  constructor(private _componentCommunication: ComponentCommunicationService, private _dataControlService: DataControlService) {
    this.dataToRenderSubscription = this._componentCommunication.dataToRenderObservable$.subscribe((data) => {
      this.dataToRender = data;
      this.prayerDataToForLoop = data?.infoFromApi;
    });

    this.dailyContent = this._dataControlService.dailyContent;

    // getting the friday pray time data from LS
    const fridayPrayTimeFromLS = localStorage.getItem(LOCAL_STORAGE_FRIDAY_PRAY_KEY);
    const parsedValue = fridayPrayTimeFromLS ? JSON.parse(fridayPrayTimeFromLS) : '--:--';
    this.isFridayPrayTimeSelected = fridayPrayTimeFromLS ? true : false;
    this.timeValue = parsedValue;
  }
  

  ngOnInit(): void {
    // To dynamically render current time
    timer(0, 1000).subscribe(() => {
      this.currentDateTime = new Date()

      this.prayerTimePeriodKey = this.findTimePeriod()

      if (this.currentDateTime.getHours() >= 18) {
        this.mosqueDay = 'none';
        this.mosqueNight = 'block';
      } else {
        this.mosqueDay = 'block';
        this.mosqueNight = 'none'
      }
    })
  }

  private findTimePeriod(): string | undefined {
    const currentTotalMinutes = this.currentDateTime.getHours() * 60 + this.currentDateTime.getMinutes();
    const prayerTimesToExtract = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
    const prayerTimesWithKeyValue = prayerTimesToExtract.map((key) => ({
      key: key,
      value: (this.dataToRender?.infoFromApi as unknown as { [key: string]: string })[key]
    }))

    let closestTimePeriod;
    let minTimeDifference = Number.MAX_VALUE;

    for (const key in prayerTimesWithKeyValue) {
      if (prayerTimesWithKeyValue.hasOwnProperty(key)) {
        const timeParts = prayerTimesWithKeyValue[key].value.split(':');
        const timeTotalMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
        const timeDifference = currentTotalMinutes - timeTotalMinutes;
        if (timeDifference >= 0 && timeDifference < minTimeDifference) {
          minTimeDifference = timeDifference;
          closestTimePeriod = prayerTimesWithKeyValue[key]
        }
      }
    }
    return closestTimePeriod?.key;
  }

  // The method and varialble below is used for select and display friday pray time
  public timeValue: string;
  public isFridayPrayTimeSelected: boolean;


  public toggleFridayPrayTime(): void {
    if (this.isFridayPrayTimeSelected) {
      this.isFridayPrayTimeSelected = false;
    } else {
      this.isFridayPrayTimeSelected = true;
      const stringifiedValue = JSON.stringify(this.timeValue);
      localStorage.setItem(LOCAL_STORAGE_FRIDAY_PRAY_KEY, stringifiedValue)
    }
  }

  ngOnDestroy(): void {
    this.dataToRenderSubscription.unsubscribe();
  }
}
