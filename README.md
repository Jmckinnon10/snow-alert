# snow-alert

### 1

- Subscribe to notifications via postman
- Get weather notifications through twilio SMS

### 2

- Subscribe to notifications via React front end
- Get weather notifications through twilio SMS

### 3

- Subscribe to notifications via inbound SMS
- Get weather notifications through twilio SMS

```
Weather API - https://www.weatherapi.com/my/

Client_ID:
805996574777-i47e0sg7t3518ednqf0ego43ervg2nvg.apps.googleusercontent.com
```

// this describes the lambda code
// Wake up every x minutes
// _ Lambda 1 wakes up pulls all #s from googlesheets and assiociated location (zipcode)
// _ for each zip code and numbers fetch API for relevancy
// _ Lambda fetches to API
// _ alert if there is > 0% of snow though Twillio

// \* Lamda 2 receives a post request and signs users up for alerts
