import Head from "next/head";
import Navbar from "./navbar";
import AbreakPlayer from '../components/abreakPlayer'
import AccountNav from '../components/accountNav'
import { AudioProvider } from "./audioHandler"
import {CookiesProvider} from 'react-cookie'
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const siteTitle= "aBreak music";

export default function FullWidthLayout({children}){

    const [navToggle, setNavToggle] = useState(false);
    const router = useRouter();

    const handleNavToggle = () => {
        setNavToggle(!navToggle);
    }

    useEffect(() => {
      setNavToggle(false);
    }, [router.asPath]);

    return (
        <>
            <Head>
                <meta
                    name="desciption"
                    content="aBreak music"
                />
                <meta
                    name="og:title"
                    content={siteTitle}
                />
            </Head>
            <Navbar 
                toggle={navToggle}
            />
            <CookiesProvider>
                <AudioProvider>
                    <div className="top-bar w-full lg:w-[85vw] h-[140px] lg:h-[70px] fixed z-50 flex flex-col-reverse lg:flex lg:flex-row top-0 lg:ml-[15vw] bg-white">
                        <AbreakPlayer></AbreakPlayer>
                        <AccountNav
                            toggleNav={handleNavToggle}
                        ></AccountNav>
                    </div>
                    <main className="pt-[140px] lg:pt-0 lg:w-[75vw] lg:fixed lg:ml-[15vw] lg:mt-[70px] bg-white h-full lg:flex items-start" id="app-main">
                        <div className="w-[100%] overflow-y-auto h-full pb-[125px]">{children}</div>
                    </main>
                </AudioProvider>
            </CookiesProvider>
        </>

    )
}