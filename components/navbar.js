import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import SocialIcons from './socialIcons';

function NavLink({to, children}) {
    const router = useRouter();
    let classStr = '';    
    if(router.pathname == to){
        classStr += ' text-yellow-400';
    }

    return <Link href={to} className={classStr}>
        {children}
    </Link>
  }

export default function Navbar({toggle}){

    const [mobileNav, setMobileNav] = useState(false);
    const router = useRouter();

    const handleResize = () => {
        if(window.innerWidth < 1024){
            setMobileNav(true);
        }else {
            setMobileNav(false);
        }
      }

    const handleHomeClick = () => {
        router.push("/");
    }

    useEffect(()=>{
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    return (
            <div className={`
                pt-8 
                pb-14 
                lg:py-0 
                top-[140px] 
                lg:top-0 
                w-full 
                lg:w-[15vw] 
                fixed 
                nav-background 
                lg:h-full 
                navbar-left
                z-20
                lg:z-0
                ${mobileNav && "mobile-nav"}
                ${mobileNav && toggle && "nav-toggle"}
                `}>
                <div className="hidden lg:block lg:p-3 lg:mb-4">
                    <img onClick={handleHomeClick} src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2023/03/abreak-logo-ALL-WHITE-TEXT.png`} />
                </div>
                <ul className="px-4">
                    <li><NavLink to="/abreak58-playlist">aBreak58 playlist</NavLink></li>
                    <li><NavLink to="/wtf-is-abreak" >wtf is aBreak music</NavLink></li>
                    <li><NavLink to="/this-weeks-adds" ><span>'adds'</span> this week</NavLink></li>
                    <li><NavLink to="/recurrents" >recurrents playlist</NavLink></li>
                    {process.env.NEXT_PUBLIC_PREMIUM == true && (
                            <li><NavLink to="/articles" >aBreak blitz</NavLink></li>
                        )
                    }
                    <li><NavLink to="/major-connections" >major connections</NavLink></li>
                    <li><NavLink to="/walking-the-walk" >walking the walk</NavLink></li>
                    {/*<li><NavLink to="/press-releases" >press releases</NavLink></li>*/}
                    {/*<li><NavLink to="/coming-soon" >coming soon</NavLink></li>*/}
                </ul>
                <div className="hidden lg:block navbar-bottom text-white px-2 lg:absolute bottom-[50px]">
                    <p className="text-center text-xs"><em>we are following indie artists on the following platforms.</em></p>
                    <SocialIcons theme="dark"></SocialIcons>
                </div>
                <div className={`absolute bottom-0 bg-[url(https://abreakmusic.wpengine.com/wp-content/uploads/2021/12/abreak-diagonal-white.png)] bg-cover h-[35px] w-full`}></div>
            </div>
    )
}