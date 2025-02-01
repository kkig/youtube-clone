# YouTube API Services

Public API services that will be triggered by events (ex. user creation).


## Firebase Functions

[Firebase Functions](https://firebase.google.com/docs/functions) are built on top of [Google Cloud Functions](https://cloud.google.com/functions). Cloud functions are event-driven, and serverless **F**unction-**A**s-**A**-**S**ervice(FAAS).

### Setting Up
Go to `Build > Function` in [Firebase console](https://console.firebase.google.com/?authuser=3). Click `Get started` to launch installation flow.

Install Firebase command line tools to your computer:
```
$ npm install -g firebase-tools
```
Authenticate:
```
firebase login
```

## Firebase Emulator

Firebase Emulator will start a local instance of the firebase services that we can use for development.

Run below in `/functions` to start the firebase emulator suite:
```
npm run serve
```

## Deploy Firebase Functions

Deploy the function:
```
firebase deploy --only functions
```
NOTE: You may need to run `npm install` before deploying.