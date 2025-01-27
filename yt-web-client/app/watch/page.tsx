'use client';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function Video() {
    /**
     * TODO: Remove hardcoded configuration
     */
    const videoPrefix = "https://storage.googleapis.com/nc-yt777-processed-videos/";
    const videoSrc = useSearchParams().get("v");

    return (
        <div>
            <h1>Watch Page</h1>
            <video controls src={videoPrefix + videoSrc} />
        </div>
    );

}

export default function Watch() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Video />
        </Suspense>
    )
}