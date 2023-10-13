export const environment = {
    prduction: true,
    locationApi: {
        url: 'https://us1.locationiq.com/v1/reverse?key=<API_KEY>'
    },
    diyanetApi: {
        userInfo: {
            email: '',
            password: ''
        },
        endPoints: {
            dailyContent: 'https://awqatsalah.diyanet.gov.tr/api/DailyContent',
            getToken: 'https://awqatsalah.diyanet.gov.tr/Auth/Login',
            countries: 'https://awqatsalah.diyanet.gov.tr/api/Place/Countries',
            cities: 'https://awqatsalah.diyanet.gov.tr/api/Place/Cities',
            oneState: 'https://awqatsalah.diyanet.gov.tr/api/Place/States/',
            oneCity: 'https://awqatsalah.diyanet.gov.tr/api/Place/Cities/',
            prayerTime: 'https://awqatsalah.diyanet.gov.tr/api/PrayerTime/Daily/'
        }
    }
};
