# YouTube Clone

YouTube Clone service that user can upload and watch videos.

### Frontend
React frontend where user can watch videos, log in, and upload videos as logged in user.

### YouTube API Services
Event-driven functions(FAAS) that handles events such as user creation, and generating link to upload video as authenticated user. Triggered through Firebase from Frontend. 

### Video Processing Service
Internal-only API. When video is uploaded to the raw video Cloud Bucket, Pub/Sub will trigger this API to process video. After processing, video will be saved to processed video Cloud Bucket.

## Enable CORS for Cloud Storage Bucket
Enable CORS for Cloud Storage Bucket, so that Next.js app can upload videos to it.
```
gcloud storage buckets update gs://<YOUR_RAW_VIDEOS_BUCKET_NAME> --cors-file=utils/gcs-cors.json
```
