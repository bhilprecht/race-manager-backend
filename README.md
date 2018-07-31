# RaceManager Backend

Backend for [Racemanager](https://github.com/benni1371/mobileProjectDHBW) application.

To start, clone the repository and type
```
npm install
npm start
```

Alternatively, the app is deployed on [heroku](https://racemanager-mobile-project.herokuapp.com/heartbeat).

Please provide the following environment variables for OneSignal
- APP_AUTH_KEY
- APP_ID
- USER_AUTH_KEY

Optionally, you can also provide
- MONGODB_URI.
Otherwise the standard MongoDB uri is used. 

For every request targeting a specific team you have to provide the custom header X-Team-Member-Id with a valid team member id. 

Currently the server is not production-ready. We postponed:

- Authentication and Authorization 
- Logging
- Automatic tests