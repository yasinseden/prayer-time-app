export const environment = {
    prduction: false,
    locationApi: {
        url: 'https://us1.locationiq.com/v1/reverse?key=pk.997a209f06eb5c41070a2bcd8aefe38e'
    },
    diyanetApi: {
        userInfo: {
            email: "ozuturkoz@gmail.com",
            password: "9cD?%4mE"
        },
        endPoints: {
            dailyContent: 'https://awqatsalah.diyanet.gov.tr/api/DailyContent',
            getToken: 'https://awqatsalah.diyanet.gov.tr/Auth/Login',
            countries: 'https://awqatsalah.diyanet.gov.tr/api/Place/Countries',
            cities: 'https://awqatsalah.diyanet.gov.tr/api/Place/Cities',
            statesOfACountry: 'https://awqatsalah.diyanet.gov.tr/api/Place/States/',
            citiesOfAState: 'https://awqatsalah.diyanet.gov.tr/api/Place/Cities/',
            prayerTime: 'https://awqatsalah.diyanet.gov.tr/api/PrayerTime/Daily/'
        }
    }
};

// To Reverse Geocoding
// https://us1.locationiq.com/v1/reverse?key=<Your_API_Access_Token>&lat=51.50344025&lon=-0.12770820958562096&format=json