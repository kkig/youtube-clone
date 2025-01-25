# YouTube Clone Web Client
On Web Client, user can watch video, log into the service, and upload new video. If user without account try to log in, it will create user data on Firebase and authenticate the user. After the authentication, upload icon will appear on the page. User can upload new video by clicking the icon.

## Upload icon
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