export interface IPrayerInfo {
    locationInfo: {
        country: string | null;
        state: string | null;
        city: string | null;
    },
    infoFromApi: {
        shapeMoonUrl: string;
        fajr: string;
        sunrise: string;
        dhuhr: string;
        asr: string;
        maghrib: string;
        isha: string;
        astronomicalSunset: string;
        astronomicalSunrise: string;
        hijriDateShort: string;
        hijriDateShortIso8601: null;
        hijriDateLong: string;
        hijriDateLongIso8601: null;
        qiblaTime: string;
        gregorianDateShort: string;
        gregorianDateShortIso8601: string;
        gregorianDateLong: string;
        gregorianDateLongIso8601: string
        greenwichMeanTimeZone: number;
    } | undefined
}

export class PrayerInfo implements IPrayerInfo {
    constructor(
        public locationInfo: {
            country: string | null;
            state: string | null;
            city: string | null;
        },
        public infoFromApi: {
            shapeMoonUrl: string;
            fajr: string;
            sunrise: string;
            dhuhr: string;
            asr: string;
            maghrib: string;
            isha: string;
            astronomicalSunset: string;
            astronomicalSunrise: string;
            hijriDateShort: string;
            hijriDateShortIso8601: null;
            hijriDateLong: string;
            hijriDateLongIso8601: null;
            qiblaTime: string;
            gregorianDateShort: string;
            gregorianDateShortIso8601: string;
            gregorianDateLong: string;
            gregorianDateLongIso8601: string
            greenwichMeanTimeZone: number;
        } | undefined) { }
}

