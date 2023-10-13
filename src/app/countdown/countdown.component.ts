import { Component } from '@angular/core';
import { ComponentCommunicationService } from '../services/component-communication.service';
import { PrayerInfo } from '../interfaces/prayer-time-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent {

  public countdown: string = '';
  public countdownInterval: any;
  public dataToRenderArr: string[] = [];
  private dataToRender: PrayerInfo | undefined;
  private dataToRenderSubscription: Subscription;

  constructor(private _componentCommunication: ComponentCommunicationService) {
    this.dataToRenderSubscription = this._componentCommunication.dataToRenderObservable$.subscribe((data) => {
      this.dataToRender = data;
      if (this.dataToRender?.infoFromApi) {
        this.dataToRenderArr = [];
        const { fajr, dhuhr, asr, maghrib, isha } = this.dataToRender.infoFromApi;
        this.dataToRenderArr.push(fajr, dhuhr, asr, maghrib, isha);
        console.log(this.dataToRenderArr);
      }
    });

  }

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown() {

    this.countdownInterval = setInterval(() => {
      const timeDifference = this.getTimeDifference()

      if (timeDifference && timeDifference > 0) {
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (60 * 1000));
        const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

        const controlArray = [hours, minutes, seconds];
        const countdownArr = this.addZero(controlArray);

        this.countdown = `${countdownArr[0]}:${countdownArr[1]}:${countdownArr[2]}`
      }
    }, 1000)
  }

  // with this method the time data from api is converted to ms data and the method returns ms data to use for countdown
  getTimeDifference() {
    let timeDifference = 0; let count = 1;
    for (let i = 0; i <= this.dataToRenderArr.length; i++) {
      const hourAndMinute = this.dataToRenderArr[i].split(':');
      const hour = hourAndMinute[0];
      const minute = hourAndMinute[1];
      const yearData = this.dataToRender?.infoFromApi?.gregorianDateLongIso8601.slice(0, 11);
      const fullTimeData = `${yearData}${hour}:${minute}`;
      const currentTime = new Date();
      const targetTime = new Date(fullTimeData);
      count++;

      timeDifference = targetTime.getTime() - currentTime.getTime();

      // At this point the time difference is checked and if it's a negative number the method returns time difference between current time and fajr (sabah) time of tomorrow because the only negative response can be respond if the current time is between isha (yatsı) and the midnight
      if (timeDifference > 0) {
        return timeDifference
      } else if (count > this.dataToRenderArr.length && timeDifference <= 0) {
        const fullHour = this.dataToRenderArr[0].split(':');
        const newHour = fullHour[0];
        const newminute = fullHour[1];
        const newFullTime = `${yearData}${newHour}:${newminute}`
        const newTargetTime = new Date(newFullTime)
        timeDifference = newTargetTime.getTime() + (24 * 60 * 60 * 1000) - currentTime.getTime();
        return timeDifference;
      }
    }
    return -1;
  }

  addZero(numberArr: number[]) {
    const valueToReturn = [];
    for (let i = 0; i < numberArr.length; i++) {
      if (numberArr[i] < 10) {
        const value = '0' + numberArr[i];
        valueToReturn.push(value);
      } else {
        valueToReturn.push(numberArr[i]);
      }
    }
    return valueToReturn;
  }

  ngOnDestroy(): void {
    this.dataToRenderSubscription.unsubscribe();
    clearInterval(this.countdownInterval)
  }
}
