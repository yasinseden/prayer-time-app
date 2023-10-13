import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PrayerInfo } from '../interfaces/prayer-time-model';

@Injectable({
  providedIn: 'root'
})
export class ComponentCommunicationService {

  public dataToRenderBehaviralObject: BehaviorSubject<PrayerInfo | undefined> = new BehaviorSubject<PrayerInfo | undefined>(undefined);
  public dataToRenderObservable$ = this.dataToRenderBehaviralObject.asObservable();

  constructor() { }
}
