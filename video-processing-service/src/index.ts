import express, { Request, Response } from 'express';
import { 
    uploadProcessedVideo,
    downloadRawVideo,
    deleteRawVideo,
    deleteProcessedVideo,
    convertVideo,
    setupDirectories
} from './storage';

import { isVideoNew, setVideo } from './firestore';

// Create the local directories for videos
setupDirectories();

const app = express(); 
app.use(express.json());    // Parse JSON bodies

// Process a video file from Cloud Storage into 360p
app.post('/process-video', async (req: Request, res: Response) => {
    
    // Get the bucket and filename from the Cloud pub/sub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error('Invalid message payload received.');
        }
    } catch (err) {
        console.error(err);
        res.status(400).send('Bad Request: missing filename.');
        return;
    }

    const inputFileName = data.name;    // Format of <UID>-<DATE>.<EXTENSION>
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split(".")[0];

    if (!isVideoNew(videoId)) {
        res.status(400).send("Bad Request: video already processing or processed.");
        return;
    } else {
        await setVideo(videoId, {
            id: videoId,
            uid: videoId.split("-")[0],
            status: "processing"
        })
    }

    // Download the raw video from Cloud Storage
    await downloadRawVideo(inputFileName);

    // Convert the video to 360p
    try {
        await convertVideo(inputFileName, outputFileName);
    } catch (err) {
        await Promise.all([ 
            deleteRawVideo(inputFileName),  
            deleteProcessedVideo(outputFileName)
        ]);

        console.error(err);
        res.status(500).send('Internal Server Error: video processing failed.');
        return;
    }

    // Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);

    // Merge to the exising setVideo() with the status 'processing'
    await setVideo(videoId, {
        status: "processed",
        filename: outputFileName
    })

    await Promise.all([ 
        deleteRawVideo(inputFileName),  
        deleteProcessedVideo(outputFileName)
    ]);

    res.status(200).send('Video processed successfully.');
    return;
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service is running on port http://localhost:${port}`);
});