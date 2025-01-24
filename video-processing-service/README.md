# Video Processing Service on Google Cloud Run

This service will handle video processing and record its metadata in Firestore. When raw video file is uploaded to the Cloud Bucket, Pub/Sub will make POST `/process-video` request that trigers video processing.


## Video Processing

Download the video from the raw video bucket. After processing, the outcome will be uploaded to the processed video bucket.


## Save Video Metadata

Before processing the video, save video metadata and processing status `processing` to `videos` collection in Firestore. When the process is complete, update the status to `processed`.


## Deployment

### Set Up Artifact Registry

Enable artifact registry:
```
gcloud services enable artifactregistry.googleapis.com
```


Create an Artifact Registory:
```
gcloud artifacts repositories create video-processing-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository for video processing service"
```

### Upload Docker image to the Registory

Build Docker image:
```
docker build -t us-central1-docker.pkg.dev/<PROJECT_ID>/video-processing-repo/video-processing-service .
```
If you are using mac, add `--platform linux/amd64`. Docker knows where to push the image with the naming scheme.


Configure Docker to use gcloud as the credential helper:
```
gcloud auth configure-docker us-central1-docker.pkg.dev
```

Push the Docker image to Google Artifact Registry:
```
docker push us-central1-docker.pkg.dev/<PROJECT_ID>/video-processing-repo/video-processing-service
```

### Deploy Docker image to Google Cloud Run
Enable cloud run:
```
gcloud services enable run.googleapis.com
```

Deploy to Cloud Run:
```
gcloud run deploy video-processing-service --image us-central1-docker.pkg.dev/PROJECT_ID/video-processing-repo/video-processing-service \
  --region=us-central1 \
  --platform managed \
  --timeout=3600 \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=1 \
  --ingress=internal
```