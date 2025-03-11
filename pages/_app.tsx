import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import FullWidthLayout from '../components/fullWIdthLayout'
import NProgress from 'nprogress' //nprogress module
import 'nprogress/nprogress.css' //styles of nprogress
import Router, { useRouter } from 'next/router'
import '../styles/nprogress.css'
import {CookiesProvider} from 'react-cookie';
import {ReactNode, useEffect, useReducer, useState} from 'react'
import {NextPage} from 'next'
import {AudioProvider} from '../components/audioHandler'
import "@fontsource/comfortaa"
import "@fontsource/open-sans"
import Script from 'next/script'
 
type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type Props = AppProps & {
  Component: Page;
};

//Route Events. 
NProgress.configure({ showSpinner: true })
Router.events.on('routeChangeStart', () =>{ NProgress.start()}); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());


export default function App({ Component, pageProps }: Props) {

  const [navToggle, setNavToggle] = useState(false);
  const router = useRouter();

    const handleNavToggle = () => {
        setNavToggle(!navToggle);
    }

    useEffect(() => {
      setNavToggle(false);
    }, [router.asPath]);

  const getLayout = Component.getLayout || ((page : ReactNode) => {
    return (
      <>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-C6YEQ2MHR5');
        `}
      </Script>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-C6YEQ2MHR5"
        strategy="afterInteractive"
      />
      <CookiesProvider>
        <AudioProvider>
          <Layout>    
              {page}
          </Layout>
        </AudioProvider>
      </CookiesProvider>
      </>
    )
  });
  return getLayout(<Component {...pageProps} />)
}
