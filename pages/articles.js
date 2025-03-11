import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import {useRouter} from 'next/router'
import CenterFooter from '../components/centerFooter'
import LoginForm from '../components/loginForm'
import { useEffect, useRef, useState } from 'react'
import parse from 'html-react-parser'
import cookie from "cookie"
import PremiumUpgradeCallout from '../components/premiumUpgradeCallout'
import { FaSearch } from 'react-icons/fa'
import { DateTime } from 'luxon'


export async function getStaticProps(context) {
    
    //let fetchUrl = `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/magazine/edition/`;
    let fetchUrl = `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/wp/v2/posts?_fields=title,date_gmt,slug,link,excerpt,acf&acf_format=standard`;
    const res = await fetch(fetchUrl);
    const contentData = await res.json();
    
    return {
      props: {articleList: contentData}, // will be passed to the page component as props
    }
  }

export default function Page({articleList}) {

  const [headerImageSet, setHeaderImageSet] = useState([
    "/wp-content/uploads/2023/01/aBreak-newsletter-resized.png",
    "/wp-content/uploads/2023/01/1.png",
    "/wp-content/uploads/2023/01/5.png"
  ]);
  const [headerImage, setHeaderImage]= useState(headerImageSet[0]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [articleData, setArticleData] = useState(articleList);
  const articleSearchRef = useRef(null);

  const handleHeaderChange = (imageNum) => {
    setHeaderImage(headerImageSet[imageNum]);
  }

  const searchArticles = () => {
    let searchTerm = articleSearchRef.current.value;
    setSearchTerm(searchTerm);
  }

  useEffect(()=>{
    if(searchTerm){
      let searchUrl = `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/wp/v2/posts?search=` + encodeURIComponent(searchTerm) + "&_fields=title,slug,link,excerpt,acf&acf_format=standard";
      fetch(searchUrl).then((res) => res.json())
      .then((data) => {
          setArticleData(data);
      })
    }else {
      let fetchUrl = `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/wp/v2/posts?_fields=title,date_gmt,post_date,slug,link,excerpt,acf&acf_format=standard`;
      fetch(fetchUrl).then((res) => res.json())
      .then((data) => {
          setArticleData(data);
      })
    }
  }, [searchTerm])

  return (
    <div className={styles.container}>
      <Head>
        <title>aBreak music - articles</title>
        <meta name="description" content="aBreak music - articles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="pt-2">
            
            <div className="mt-2 lg:mt-0 w-full m-auto mb-4 text-center">
              <img src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS + headerImage}`} alt="aBreak blitz newsletter" />
              <hr className="my-4" />
            </div>
            <div className="flex justify-evenly items-center mb-4 hidden">
              <button onClick={(e) => handleHeaderChange(0)} className="gray-button">header 1</button>
              <button onClick={(e) => handleHeaderChange(1)} className="gray-button">header 2</button>
              <button onClick={(e) => handleHeaderChange(2)} className="gray-button">header 3</button>
            </div>
            <div className="w-full flex items-center mb-4">
              <input ref={articleSearchRef} className="form-control w-[70%] border p-2 mr-2 border-slate-300 border-rounded"></input>
              <button onClick={searchArticles} className="yellow-button w-[30%] text-center"><FaSearch className="mr-2" /> search articles</button>
            </div>
              <div>
                {articleData && articleData.map((article, index)=> (
                    <div className="px-6 border-b last:border-b-0 mb-4 text-left" key={index}>
                        <button type="button"><Link href={"/articles/" + article.slug}><h2 className="text-2xl mb-2 text-purple-600 text-left">{parse(article.title.rendered)}</h2></Link></button>
                        <div>
                           <small className="block pb-4 text-slate-600">{DateTime.fromISO(article.date_gmt).toLocal().toLocaleString({...DateTime.DATE_MED,weekday: 'long'})}</small>
                            {article.excerpt != null && parse(article.excerpt.rendered)}
                        </div>
                        {article.acf.subscription_type == "free" ? (
                          
                            <button type="button" className="yellow-button small-button my-4">
                              {article.acf.external_link != "" ? (
                                <Link href={article.acf.external_link} target="_blank">read more</Link>
                              ) : (
                                <Link href={"articles/" + article.slug}>read more</Link>
                              )}
                            </button>
                          
                          
                        ):(
                          <div className="flex items-center"><button type="button" className="yellow-button small-button my-4 premium-button"><Link href={"articles/" + article.slug}>read more</Link></button><span className="text-purple-600 ml-2 inline-block">aBreak insider</span></div>
                        )}
                    </div>
                ))}
              </div>

            <CenterFooter></CenterFooter>

        </div>
      
    </div>
  )
}