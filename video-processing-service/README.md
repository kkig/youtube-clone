# Video Processing Service on Google Cloud Run

This service will handle internal video processing and record its metadata in Firestore. 

1. Upload video to Google Cloud Bucket (raw video bucket) from client.
2. Bucket will trigger [Pub/Sub push notification](https://cloud.google.com/pubsub/docs/push) to POST `/process-video`.
3. Process video with ffmpeg.
4. Save output to Google Cloud Bucket (processed video bucket).

### Save Video Metadata

Before processing the video, metadata with processing status will be saved in `videos` collection of Firestore. Status will be updated as process go through.
- `processing` - Started processing.
- `processed` - Processing finished.

## Create Firebase Project

This project require [Firebase project](https://console.firebase.google.com/). Please take note of `project id`. When we create a new firebase project, it will also create Google Cloud project as well.

## Install Google CLI tools
Install `gcloud` and `gsutil` CLI tools.
https://cloud.google.com/sdk/docs/install

Authenticate with your account and set your project:

```
gcloud auth login
gcloud config set project <PROJECT_ID>
```

## Deployment

When deploying the application, first push the container to the Artifact Registory. After that, deploy it to Cloud Run.

### Set Up Artifact Registry
Set Up Artifact Registry:
```
gcloud services enable artifactregistry.googleapis.com
```
Create an Artifact Registory:
```
gcloud artifacts repositories create <REGISTORY_REPO_NAME> \
  --repository-format=docker \
  --location=<YOUR_REGION> \
  --description="Docker repository for video processing service"
```

### Push image to Artifact Registry
Build Docker image:
```
docker build -t <YOUR_REGION>-docker.pkg.dev/<PROJECT_ID>/<REGISTORY_REPO_NAME>/<CONTAINER_NAME> .
```
If you are using mac, add `--platform linux/amd64`. Docker knows where to push the image with the naming scheme.


Configure Docker to use gcloud as credential helper:
```
gcloud auth configure-docker <YOUR_REGION>-docker.pkg.dev
```

Push the Docker image to Artifact Registry:
```
docker push <YOUR_REGION>-docker.pkg.dev/<PROJECT_ID>/<REGISTORY_REPO_NAME>/<CONTAINER_NAME>
```

### Deploy Docker image to Google Cloud Run
Enable cloud run:
```
gcloud services enable run.googleapis.com
```

Deploy to Cloud Run:
```
gcloud run deploy <CONTAINER_NAME> --image <YOUR_REGION>-docker.pkg.dev/<PROJECT_ID>/<REGISTORY_REPO_NAME>/<CONTAINER_NAME> \
  --region=<YOUR_REGION> \
  --platform managed \
  --timeout=3600 \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=1 \
  --ingress=internal
```

## Cloud Pub/Sub 
Set up Pub/Sub to get notification when raw video is uploaded.

Create Pub/Sub topic:
```
gcloud pubsub topics create <TOPIC_NAME>
```

Create subscription:
For `--push-endpoint`, use your Cloud Run service's URL plus video processing service endpoint you defined. 

Example: 
`https://video-processing-service-123456789012.us-central1.run.app/process-video`
```
gcloud pubsub subscriptions create <SUBSCRIPTION_NAME> \
  --topic=<TOPIC_NAME> \
  --push-endpoint=<SERVICE_URL> \
  --ack-deadline=600
```

## Cloud Storage Bucket

Create buckets to store raw and processed videos.

Create raw video bucket:
```
gsutil mb -l <YOUR_REGION> --pap=enforced gs://<RAW_BUCKET_NAME>
```

Configure bucket to send file upload notifications to Pub/Sub topic:
```
gsutil notification create -t <TOPIC_NAME> -f json -e OBJECT_FINALIZE gs://<RAW_BUCKET_NAME>
```

Create processed video bucket:
```
gsutil mb -l <YOUR_REGION> gs://<BUCKET_NAME>
```