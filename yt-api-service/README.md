# YouTube API Services

Public API services that will be triggered by events. 

**createUser:** Triggered automatically every time user is created using Firebase Auth. UID in Firebase Auth will match with the one in Firestore Database.

**generateUploadUrl:** It is built using Cloud function, powered by Cloud Run. In firebase function, we can confirm that the user is signed in before generating the URL. It will generate [short-lived signed URL](https://cloud.google.com/storage/docs/access-control/signed-urls) that expires after a certain amount of time. You can see the details of this function on Firebase console, Cloud Function console, and Cloud Run console. 



## Firebase Functions

[Firebase Functions](https://firebase.google.com/docs/functions) are built on top of [Google Cloud Functions](https://cloud.google.com/functions). Cloud functions are event-driven, and serverless **F**unction-**A**s-**A**-**S**ervice(FAAS).

### Setting Up
Go to `Build` > `Function` in [Firebase console](https://console.firebase.google.com/?authuser=3). Click `Get started` to launch installation flow.

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


## Permissions
Grant role to service account to access raw video Cloud Storage Bucket, because it is set to `private`.

### Service account
Find service account for `generateUploadUrl` in Cloud Run Console. `YAML` > `serviceAccountName`.

### Cloud Storage Bucket Console
Select raw video bucket > `Permissions` tab. Click `Grant Access` and add `Cloud Storage` > `Storage Object Admin` role to the service account.

### IAM
Select the same service account and add `Service Account Token Creater` role. 

## Reference
- [Create Signed URL](https://cloud.google.com/storage/docs/samples/storage-generate-upload-signed-url-v4#storage_generate_upload_signed_url_v4-nodejs)
- [Firebase Functions v1 and v2](https://firebase.google.com/docs/functions/version-comparison)
- [Cloud Functions v1 and v2](https://cloud.google.com/functions/docs/concepts/version-comparison)
- [onCall Function](https://firebase.google.com/docs/functions/callable?gen=2nd)