import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import CenterFooter from '../components/centerFooter'
import { useRef, useState } from 'react'
import parse from 'html-react-parser'
import ArtistVideoModal from '../components/artistVideoModal'
import ArtistVideoCircleImage from '../components/artistVideoCircleImage'


export async function getStaticProps(context) {
    
    let fetchUrl = `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/abreakartistvideos/videos`;
    //let fetchUrl = `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/wp/v2/artist_video?_fields=title,date_gmt,slug,link,excerpt,acf&acf_format=standard`;
    //let fetchUrl = `http://abreakmusic.local/wp-json/abreakartistvideos/videos`;
    
    const res = await fetch(fetchUrl);
    const contentData = await res.json();
    
    return {
      props: {articleList: contentData}, // will be passed to the page component as props
    }
  }

export default function Page({articleList}) {

  const [articleData, setArticleData] = useState(articleList);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoModalContent, setVideoModalContent] = useState(null);
  const [videoModalTitle, setVideoModalTitle]= useState(null);
  const articleSearchRef = useRef(null);

  const handleVideoLinkClick = (videoData) => {
    setVideoModalContent(videoData);
    setVideoModalTitle(videoData.artist_name)
    setShowVideoModal(true);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>aBreak music - press releases</title>
        <meta name="description" content="aBreak music - press releases" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="pt-2">
            
            <div className="mt-2 lg:mt-0 w-full m-auto mb-4 text-center">
                <h1 className="page-title text-center px-4 lg:px-2 mt-[25px]" >videos</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse imperdiet ornare quam at cursus. Mauris lobortis, lacus at condimentum maximus, lectus elit laoreet enim, non fringilla leo ipsum sit amet neque. Morbi congue dolor quis nulla scelerisque tincidunt. </p>
                <hr className="my-4" />
            </div>

              <div className="artistVideoGrid">
                {articleData && articleData.map((article, index)=> (
                    <div className="px-6 border-b last:border-b-0 mb-4 text-center" key={index}>
                        <ArtistVideoCircleImage
                            imgSrc={article.artist_image}
                        >
                        </ArtistVideoCircleImage>
                        <button onClick={()=>handleVideoLinkClick(article)}><h2 className="text-2xl mt-2 mb-2 text-purple-600 text-center">{parse(article.artist_name)}</h2></button>
                        <div className="text-center">
                            <button onClick={()=>handleVideoLinkClick(article)} className="m-auto mb-4 inline-block bg-amber-400 rounded-lg px-4 py-[5px]">view</button>
                        </div>
                    </div>
                ))}
              </div>
            
            <ArtistVideoModal
                onClose={() => setShowVideoModal(false)}
                show={showVideoModal}
                title={videoModalTitle}
                content={videoModalContent}
            ></ArtistVideoModal>
            <CenterFooter></CenterFooter>

        </div>
      
    </div>
  )
}