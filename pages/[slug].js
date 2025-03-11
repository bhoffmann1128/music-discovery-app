import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import {useRouter} from 'next/router';
import parse from 'html-react-parser'
import { useEffect, useState } from 'react';
import MainPlaylist from '../components/MainPlaylist'
import AddsPlaylist from '../components/AddsPlaylist'
import RegisterCallout from '../components/RegisterCallout';
import CenterFooter from '../components/centerFooter'
import DataCarousel from '../components/DataCarousel';
import GridComponent from '../components/GridComponent';
import SpikedInPlaylist from '../components/SpikedinPlaylist';
import ArchivePlaylist from '../components/archivePlaylist';
import Moment from 'react-moment';
import RecurrentsPlaylist from '../components/recurrentsPlaylist';

export async function findPosition(songid,results){
  let position = false;
  results.forEach(function(item){
    if(item.songid == songid){
      position = item.positions;
    }
  });
  return position;
}

export async function getStaticPaths() {
  //const res = await fetch(`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/wp/v2/primary-menu`);
  const res = await fetch(`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/wp/v2/api-menu`);
  let pages = null;
  try {
    pages = await res.json();
  }catch(err){
    console.log("err", err)
  }
  
  //const pages = await res.json();
  const paths = pages.map((page) => ({
    params: { slug: page.slug },
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params }) => {
    
    let fetchUrl = `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/wp/v2/pages/?slug=${params.slug}&&acf_format=standard`;
    const res = await fetch(fetchUrl);
    //const data = await res.json();
    let pageId = null;
    let data = null;
    try {
      data = await res.json();
      pageId = data[0].id;
    }catch(err){
      console.log("error", err);
    }
  
    // Response 404 page if data is failed to fetch
    if (!res.status == 202) {
       return { notFound: true };
    }
    
    const { title, description, images } = res;

    let playlistData = null;
    let playlistPositions = null;

    if(data[0].id== 785){ //archive playlist
      let playlistUrl = process.env.API_BASE + "playlist/getarchive";
        const data = await fetch(playlistUrl, {
            method: 'post',
            body: null
        });
        playlistData = await data.json();
        playlistPositions = null;
    }
    
    if(data[0].id== 348 || data[0].id==237 || data[0].id == 775 || data[0].id == 805){
        //const playlistRes = await fetch(`${process.env.APP_URL}/api/getLatestPlaylist`);
        
        let cat = 1;
        let positions = true;
        switch(pageId){
          case 348: //abreak58
            cat = 1;
            break;
          case 237: //adds
            cat = 1;
            break;
          case 775: //spiked-in
            cat = 3;
            positions = false;
            break;  
          case 805: //recurrents
            cat = 4;
            positions = false;
            break;
        }
        
        let playlistUrl = process.env.API_BASE + "playlist/getlatestplaylistordered";
        const data = await fetch(playlistUrl, {
            method: 'post',
            body: JSON.stringify({category: cat})
        });
        playlistData = await data.json();

        
      
        let songArr = new Array();
        
        if(playlistData.playlistSongs){
          playlistData.playlistSongs.forEach((song)=>{
            songArr.push(song.songid);
          });
        }
        

        if(positions == true){

          let positionData = {
            songs: songArr
          }


          let positionsFetchUrl = process.env.API_BASE + "playlist/getplaylistpositions";
          const positionsFetch = await fetch(positionsFetchUrl, {
              method: 'post',
              body: JSON.stringify(positionData)
          });
          playlistPositions = await positionsFetch.json();
        }else {
          playlistPositions = null;
        }

    }
  
    return {
       props: {
          pageHeader: {
             title: data[0].yoast_head_json.title,
             slug: params.slug,
             metas: [
                {
                   name: 'description',
                   content: data[0].yoast_head_json.og_description,
                },
                { property: 'og:title', content: data[0].yoast_head_json.og_title },
                {
                   property: 'og:image',
                   content: data[0].yoast_head_json.og_image[0].url || null,
                },
                {
                   property: 'og:description',
                   content: data[0].yoast_head_json.og_description,
                },
             ],
          },
          mainContent: data && data[0],
          playlistData: playlistData,
          playlistPositions: playlistPositions

       },
       revalidate: 5 * 60, // re-generate each 5 minutes
    };
  };

export default function Page({pageHeader, mainContent, playlistData, playlistPositions}){
  
  const [wpContent, setWpContent] = useState(null)
  
  useEffect(() => {
    setWpContent(mainContent);
    
  }, [mainContent])

  const options = {
    replace: ({ attribs, children }) => {
      if (!attribs) {
        return;
      }
      if (attribs.id === 'newAddsWeek') {
       
        return <span>{playlistData &&  <Moment format="M/DD/YYYY">{playlistData.playlistInfo.week}</Moment>}</span>;
      }
  
    }
  };

  return (
    <div className={`${pageHeader.slug} wp-page-content`}>
      <Head>
        <title>{mainContent.yoast_head_json.title}</title>
        { pageHeader.metas.map((attributes, index) => (
          <meta {...attributes} key={index} />
        )) }
      </Head>
      <div className="py-6">
        
        {mainContent && mainContent.id == 348 ? (
          <>
            <img className="px-[10vw] mb-4 mt-4" src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2022/01/abreak58-logo-final.png`} />
          </>
        ):(
          <h1 className="page-title text-center px-4 lg:px-2" >{parse(mainContent.title.rendered)}</h1>
        )}

        {wpContent && (
          <div className="px-[2vw]">
          {parse(wpContent.content.rendered, options)}
          </div>
        )}

        {/* WHO WE ARE */ mainContent && mainContent.id == 375 && (
          <GridComponent
            columnData={mainContent.acf.content[0].grid_block}>
          </GridComponent>
        )}
        
        {mainContent && mainContent.id == 348 && (
           <div>
            <MainPlaylist
              playlistData={playlistData}
              positionData={playlistPositions}
            ></MainPlaylist>
            <RegisterCallout></RegisterCallout>
          </div> 
        )}
        {mainContent && mainContent.id == 237 && (
          <div>
            <AddsPlaylist
              playlistData={playlistData}
              positionData={playlistPositions}
            ></AddsPlaylist>
            <RegisterCallout></RegisterCallout>
          </div>
        )}

        {mainContent && mainContent.id == 775 && ( //Spiked-In
          <div>
            <SpikedInPlaylist
              playlistData={playlistData}
            ></SpikedInPlaylist>
            <RegisterCallout></RegisterCallout>
          </div>
        )}
        
        {mainContent && mainContent.id == 785 && ( //Archive
          <div>
            <ArchivePlaylist
              playlistData={playlistData}
            ></ArchivePlaylist>
            <RegisterCallout></RegisterCallout>
          </div>
        )}

        {mainContent && mainContent.id == 805 && ( //Recurrents
          <div>
            <RecurrentsPlaylist
              playlistData={playlistData}
            ></RecurrentsPlaylist>
            <RegisterCallout></RegisterCallout>
          </div>
        )}  
        
        {mainContent.id && mainContent.id == 338 && (
          <div className="mb-[100px]">
          <DataCarousel
            listArray={mainContent.acf.artist_list}
          ></DataCarousel>
          </div>
        )}
        {mainContent.id && mainContent.id == 259 && (
          
          <DataCarousel
            listArray={mainContent.acf.artist_list}
          ></DataCarousel>
          
        )}


        <CenterFooter></CenterFooter>
      </div>
    </div>
  )
}
