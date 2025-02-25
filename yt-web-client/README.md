# YouTube Clone Web Client
On Web Client, user can watch video, log into the service, and upload new video. If user without account try to log in, it will create user data on Firebase and authenticate the user. After the authentication, upload icon will appear on the page. User can upload new video by clicking the icon.

## Register app with Firebase project

Go to [Firebase console](https://console.firebase.google.com/?authuser=3). Launch the setup workflow by clicking **Web icon (`</>`)**. You can find configuration to initialize your app.

## Firebase Authentication

Activating Firebase Authentication, you can authenticate user with your app. It will save basic user information such as identifier (ex. sample@gmail.com), Auth provoder (ex. Google or GitHub), the date of account creation (ex. Jan 1, 2025), and User UID. Go to `Build > Authentication` in [Firebase console](https://console.firebase.google.com/?authuser=3). Click `Get started` to launch set up flow.

## Firestore Database
Firestore Database is a serverless, fully managed NoSQL documentation database. Firebase in Native mode also offers a backend-as-a-service (BaaS) model. The database is accessible from client and controlled based on the security rules you define in `Rules` tab. 

Add database to store user information (ex. profile image) and video metadata (ex. processing status). Go to `Build > Firestore Database` in [Firebase console](https://console.firebase.google.com/?authuser=3). Click `Create database` to launch set up flow. The firestore will be also available in Google Cloud.

## Upload video
When user click upload icon, it will trigger `generateUploadUrl` function (you can find it in `yt-api-service` directory) on Cloud Run that generates Signed Url to make `PUT` request to save video file on the raw video Cloud Bucket.

## Deployment
Create repo in Google Artifact Registry.
```
gcloud artifacts repositories create yt-web-client-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker repository for youtube web client"
```

Build and push Docker image to Google Artifact Registry. If you are mac user, add `--platform linux/amd64` for the build command below.
```
docker build -t us-central1-docker.pkg.dev/<PROJECT_ID>/yt-web-client-repo/yt-web-client .
docker push us-central1-docker.pkg.dev/<PROJECT_ID>/yt-web-client-repo/yt-web-client
```

Deploy Docker image to Cloud Run.
```
gcloud run deploy yt-web-client --image us-central1-docker.pkg.dev/PROJECT_ID/yt-web-client-repo/yt-web-client \
  --region=us-central1 \
  --platform managed \
  --timeout=3600 \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=1
```

## Update allowlist of Firebase Authentication
You can see the web client live now by visiting the URL provided by Cloud Run. When you click sign in button, authentication flow will probably fail. To make the consent screen works, visit the Firebase console and add its domain to `Authentication > Settings > Authorized domains`.