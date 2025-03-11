import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import {useRouter} from 'next/router';
import VideoCircle from '../components/VideoCircle'
import CenterFooter from '../components/centerFooter';
import FooterMarquee from '../components/FooterMarquee';
import VideoSquare from '../components/VideoSquare';

export const getStaticProps = async ({ params }) => {
 
  //fetch latest video link
  //let fetchVideosUrl = `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-json/wp/v2/video?_fields=title,acf&&acf_format=standard`;
  let fetchVideosUrl = `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-json/abreakvideonocache/videos`;

  const res = await fetch(fetchVideosUrl);
  const videosData = await res.json();

  var currentVideo = videosData[0];
  console.log("CURRENT VIDEO: " , videosData);

  /*let currentDate = new Date();
  var currentVideo = videosData.filter( video => { 
      var d = new Date( video.acf.video_schedule ); 
      return currentDate >= d;
  })[0];*/

  return {
    props: {video: currentVideo},
    revalidate: 10,
  }
}



export default function Page({video}) {

  return (
    <div className={styles.container + " h-full relative"}>
      <Head>
        <title>aBreak music - home</title>
        <meta name="description" content="aBreak Music is a free music and artist discovery platform based in the US. Upload music, get the attention of the most important gatekeepers in the music industry" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      
      <div className="relative 
      w-full h-full 
      pb-10 
      lg:py-0 
      lg:h-full 
      overflow-x-hidden 
      overflow-y-hidden 
      lg:overflow-y-auto 
      flex 
      justify-center 
      lg:items-center
      content-center">
        <VideoCircle
          posterImg={video.poster_image.url}
          autoPlayVid={video.autoPlay ? true : false}
          videoUrl={process.env.NEXT_PUBLIC_CLOUDFRONT_BASE + "web_assets/" + video.video_location}
        ></VideoCircle>
      </div>

      <CenterFooter type={"vertical"}></CenterFooter>
      <FooterMarquee></FooterMarquee>
      
    </div>
  )
}
