import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { getVideos } from "./utilities/firebase/functions";

export default async function Home() {
  const videos = await getVideos();
  
  return (
    <main>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`} key={video.id}>
            <Image width={120} height={80} src="/thumbnail.png" alt="video"
              className={styles.thumnail} />
          </Link>
        ))
      }
    </main>
  );
}

// Disable cache for this page
export const revalidate = 30;