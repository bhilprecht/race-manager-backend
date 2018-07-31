# RaceManager Backend

Backend for [Racemanager](https://github.com/benni1371/mobileProjectDHBW) application.

## Introduction
It provides functionality to 
- manage teams, members, events, stints
- notify drivers
- persist the data with mongoDB
- calculate statistics for the drivers

Currently the server is not production-ready. We postponed:

- authentication and authorization 
- logging
- automatic tests

## Deployment
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

## Plugins 

We used 
- cron: for periodic job scheduling
- express: for server functionality
- mongoose: for mongo db connection
- onesignal-node: for connection to OneSignal for notifications