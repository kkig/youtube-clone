import * as functions from "firebase-functions/v1";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";


initializeApp();

const firestore = new Firestore();
const storage = new Storage();

/**
 * TODO: Remove hardcoded ID and Bucket name
 */
const rawVideoBucketName = "nc-yt777-raw-videos";

const userCollectionId = "users";
const videoCollectionId = "videos";

const region = "us-central1";

/**
 * Create document in {@link userCollectionId}
 * collection of Firestore for newly created
 * Firebase Auth user.
 */
export const createUser = functions
  .region(region)
  .auth
  .user()
  .onCreate((user) => {
    const userInfo = {
      uid: user.uid,
      email: user.email,
      photoUrl: user.photoURL,
    };

    firestore.collection("users").doc(user.uid).set(userInfo);
    logger.info(`User Created: ${JSON.stringify(userInfo)}`);
    return;
  });

/**
 * Generate short-lived signed URL to access
 * raw video Cloud Storage Bucket.
 * @returns Object with signed URL and filename,
 * otherwise throw error.
 */
export const generateUploadUrl = onCall({maxInstances: 1, region: region}, async (request) => {
  // Check if the user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(rawVideoBucketName);

  // Generate a unique filename
  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

  // Get a v4 signed URL for uploading file
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: "application/octet-stream",
  });

  return {url, fileName};
});


export const getVideos = onCall({maxInstances: 1}, async () => {
  const snapshot =
    await firestore.collection(videoCollectionId).limit(10).get();
  return snapshot.docs.map((doc) => doc.data());
});
