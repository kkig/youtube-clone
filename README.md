# YouTube Clone

YouTube Clone service that user can upload and watch videos.

## Enable CORS for Cloud Storage Bucket
Enable CORS for Cloud Storage Bucket, so that Next.js app can upload videos to it.
```
gcloud storage buckets update gs://<YOUR_RAW_VIDEOS_BUCKET_NAME> --cors-file=utils/gcs-cors.json
```
