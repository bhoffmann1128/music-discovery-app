import Head from "next/head"
import Navbar from "./navbar"
import { useRouter } from "next/router"
import AbreakPlayer from '../components/abreakPlayer'
import AccountNav from '../components/accountNav'
import SliderCallouts from '../components/sliderCallouts'
import { useEffect, useState } from "react"

export const siteTitle= "aBreak music";

export default function Layout({children}){

    const [navToggle, setNavToggle] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const router = useRouter();

    const handleNavToggle = () => {
        setNavToggle(!navToggle);
    }

    useEffect(() => {
        
        switch (router.pathname) {
            case '/dashboard':
                setShowSidebar(false);
            break;
            case '/profile/editAccount':
                setShowSidebar(false);
            break;
            case '/profile/editProfile':
                setShowSidebar(false);
            break;
            case '/profile/stepForm':
                setShowSidebar(false);
            break;
            case '/profile/upgradeAccount':
                setShowSidebar(false);
            break;
            case '/profile/updatePaymentMethod':
                setShowSidebar(false);
            break;
            case '/videos':
                setShowSidebar(false);
            break;
            default:
                setShowSidebar(true);
        }

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
                <link rel="shortcut icon" href="/images/favicon.ico" />
                <meta name="description" content="aBreak Music is a free music and artist discovery platform based in the US. Upload music, get the attention of the most important gatekeepers in the music industry." />
                <link rel="canonical" href="https://abreakmusic.com/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="wtf is abreak music?" />
                <meta property="og:description" content="aBreak Music is a free new music and artist discovery platform based in the US – and we’re very different from what you’re used to. the people running and associated with aBreak are some of the most experienced and connected executives in music." />
                <meta property="og:url" content="https://abreakmusic.com/" />
                <meta property="og:site_name" content="aBreak Music" />
                <meta property="article:publisher" content="https://www.facebook.com/abreakmusic" />
                <meta property="article:modified_time" content="2023-02-24T14:48:13+00:00" />
                {/* <meta property="og:image" content="https://abreakmusic.wpengine.com/wp-content/uploads/2023/02/abreak-facebook-card.jpg" /> */ }
                <meta property="og:image" content="https://abreakmusic.wpengine.com/wp-content/uploads/2023/07/aBreak-Logo.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="627" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="wtf is abreak music?" />
                <meta name="twitter:description" content="aBreak Music is a free new music and artist discovery platform based in the US – and we’re very different from what you’re used to. the people running and associated with aBreak are some of the most experienced and connected executives in music." />
                <meta name="twitter:image" content="https://abreakmusic.wpengine.com/wp-content/uploads/2023/07/aBreak-Logo.png" />
                <meta name="twitter:site" content="@abreakmusic" />
            </Head>
            <Navbar 
                toggle={navToggle}
            />
            
            <div className="top-bar w-full lg:w-[85vw] h-[140px] lg:h-[70px] fixed z-20 lg:z-9 lg:relative flex flex-col-reverse lg:flex lg:flex-row top-0 lg:top-0 lg:ml-[15vw] bg-white">
                <AbreakPlayer></AbreakPlayer>
                <AccountNav
                    toggleNav={handleNavToggle}
                ></AccountNav>
            </div>
            <main className="pt-[140px] lg:pt-0 lg:w-[75vw] lg:fixed lg:ml-[15vw] lg:mt-[0px] bg-white h-full lg:flex items-start" id="app-main">
                {showSidebar == true ? (
                    <>
                        <div className="relative overflow-x-hidden lg:w-[70%] overflow-y-visible lg:overflow-y-auto lg:h-full lg:pb-20 pt-[20px]">
                            {children}
                        </div>
                        <div className="px-6 lg:px-0 w-full lg:w-[30%] lg:h-full z-1">
                            <SliderCallouts></SliderCallouts>
                        </div>
                    </>
                ):(
                    <div className="w-[100%] overflow-y-auto h-full pb-[125px]">{children}</div>
                )}
            </main>
            
        </>

    )
}