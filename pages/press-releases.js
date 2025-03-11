import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import CenterFooter from '../components/centerFooter'
import { useRef, useState } from 'react'
import parse from 'html-react-parser'


export async function getStaticProps(context) {
    
    //let fetchUrl = `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/magazine/edition/`;
    let fetchUrl = `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/wp/v2/press_release?_fields=title,date_gmt,slug,link,excerpt,acf&acf_format=standard`;
    const res = await fetch(fetchUrl);
    const contentData = await res.json();
    
    return {
      props: {articleList: contentData}, // will be passed to the page component as props
    }
  }

export default function Page({articleList}) {

  const [articleData, setArticleData] = useState(articleList);
  const articleSearchRef = useRef(null);

  return (
    <div className={styles.container}>
      <Head>
        <title>aBreak music - press releases</title>
        <meta name="description" content="aBreak music - press releases" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="pt-2">
            
            <div className="mt-2 lg:mt-0 w-full m-auto mb-4 text-center">
                <h1 className="page-title text-center px-4 lg:px-2" >press releases</h1>
                <hr className="my-4" />
            </div>

              <div>
                {articleData && articleData.map((article, index)=> (
                    <div className="px-6 border-b last:border-b-0 mb-4 text-left" key={index}>
                        <a href={article.acf.press_release_pdf.url} target="_blank" rel="noreferrer"><h2 className="text-2xl mb-2 text-purple-600 text-left">{parse(article.acf.press_release_headline)}</h2></a>
                        <div>
                            <small className="block pb-4 text-slate-600">{article.acf.press_release_date}</small>
                            <a href={article.acf.press_release_pdf.url} target="_blank" rel="noreferrer" className="mb-4 inline-block bg-amber-400 rounded-lg px-4 py-[5px]">click to view</a>
                        </div>
                    </div>
                ))}
              </div>

            <CenterFooter></CenterFooter>

        </div>
      
    </div>
  )
}