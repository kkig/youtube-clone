import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

initializeApp();

const firestore = new Firestore();
const videoCollectionId = "videos";

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string
}

/**
 * @param videoId - The id of the video that may have metadata stored in 
 * {@link videoCollectionId} collection of Firestore.
 * @returns Object with metadata of the video if available, otherwise empty object.
 */
async function getVideo(videoId: string) {
    const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
    return (snapshot.data() as Video) ?? {};
}

/**
 * @param videoId - The id of the video to process and store metadata in 
 * {@link videoCollectionId} collection of Firestore.
 */
export function setVideo(videoId: string, video: Video) {
    try {
        firestore
            .collection(videoCollectionId)
            .doc(videoId)
            .set(video, { merge: true });

        console.log("Created document for metadata in Firestore.")
    } catch (err) {
        console.error(`Error: Failed to create document!!`)
    }
}

/**
 * @param videoId - The id of the video to acess the processing status
 * based on the metadata in {@link videoCollectionId} collection of Firestore.
 * @returns The status of the processing if any, otherwise undefined.
 */
export async function isVideoNew(videoId: string) {
    const video = await getVideo(videoId);
    return video?.status === undefined; 
}