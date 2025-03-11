import Head from 'next/head'
import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import RegisterCallout from '../../components/RegisterCallout'
import CenterFooter from '../../components/centerFooter'
import Link from 'next/link'
import { FaChevronLeft } from 'react-icons/fa'
import cookie from 'cookie'
import PremiumUpgradeCallout from '../../components/premiumUpgradeCallout'
import { getArtistProfile } from '../api/getArtistProfile'
import { getArtistAccount } from '../api/getArtistAccount'
import { DateTime } from 'luxon'

export async function getServerSideProps(context) {


    let {slug} = context.query;
    let fetchUrl = `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/wp/v2/posts/?slug=${slug}&&acf_format=standard`;
    const res = await fetch(fetchUrl);
    const contentData = await res.json();

    if (!res.status == 202) {
        return { notFound: true };
    }
    
    let artistProfileData = null;
    let artistAccountData = null;
    

    if(context.req.headers.cookie){
      let userInfo = cookie.parse(context.req.headers.cookie);
      let senddata = {};
      senddata.token = userInfo.abreakmusic_token;
      senddata.username = userInfo.abreakmusic_username;
      senddata.action = "get";
      senddata.role = "artist";
    
      artistProfileData = await getArtistProfile(senddata);

      artistAccountData = await getArtistAccount(senddata);
      if(artistAccountData.status=="ERROR"){
        artistAccountData = null;
      }
      
    }

    if(contentData[0].acf.subscription_type == "paid" && artistAccountData == null){
      contentData[0].content.rendered = null;
    }
    
    
    return {
      props: {
        pageHeader: {
            title: contentData[0].yoast_head_json.title || null,
            metas: [
               {
                  name: 'description',
                  content: contentData[0].yoast_head_json.og_description || null,
               },
               { 
                  property: 'og:title', 
                  content: contentData[0].yoast_head_json.og_title || null },
               {
                  property: 'og:image',
                  content: contentData[0].yoast_head_json.og_image[0].url || null,
               },
               {
                  property: 'og:description',
                  content: contentData[0].yoast_head_json.og_description || null,
               },
            ],
         },
        mainContent: contentData[0], 
        artistData: artistProfileData && artistProfileData.results[0], 
        account: artistAccountData}, 
    }
  }

export default function Page({pageHeader, mainContent, artistData, account}){
  
  const [wpContent, setWpContent] = useState(null)
  useEffect(() => {
    setWpContent(mainContent);
    
  }, [mainContent])

  const options = {
    replace: ({ attribs, children }) => {
      if (!attribs) {
        return;
      }
    }
  };
  
  return (
    <div className="wp-page-content">
      <Head>
        <title>{mainContent.yoast_head_json.title}</title>
        { pageHeader.metas.map((attributes, index) => (
          <meta {...attributes} key={index} />
        )) }
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-2 py-6">
        <button type="button" className="yellow-button"><Link href="/articles" className="flex items-center"><FaChevronLeft />&nbsp;&nbsp;back to articles</Link></button>
        {wpContent && (
          <div className="px-[2vw]">
            <h2 className="text-purple-600 text-2xl mt-6">{parse(wpContent.title.rendered)}</h2>
            <small className="block pb-4 text-slate-600">{DateTime.fromISO(mainContent.date_gmt).toLocal().toLocaleString({...DateTime.DATE_MED,weekday: 'long'})}</small>
            {artistData && (
              <>
              {account && (
                <>
                {account[0].subscription_status == "active" ? (
                  <>
                    {parse(wpContent.content.rendered, options)}
                  </>
                ):(
                  <div className="p-4 mb-4 rounded border text-center">
                    <h3>you must be a premium member to access this content</h3>
                  </div>
                )}
                </>
              )}
              </>
            )}

            {!account && (
              <div className="p-4 mb-4 mt-4 rounded border text-center">
              <h3>you must be a premium member to access this content</h3>
            </div>
            )}

            
          </div>
        )}

            {!artistData || !account ? (
              <PremiumUpgradeCallout
                isLoggedIn={false}
              ></PremiumUpgradeCallout>
            ): null}

            {account != null && (
              <>
              {account[0].subscription_status != "active" && (
                <PremiumUpgradeCallout
                  isLoggedIn={true}
                ></PremiumUpgradeCallout>
              )}
              </>
            )}

        <CenterFooter></CenterFooter>
      </div>
    </div>
  )
}
