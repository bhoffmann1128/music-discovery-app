import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import { IconContext } from 'react-icons';
import {FaBars, FaPlay, FaStop} from 'react-icons/fa';
import {useCookies} from 'react-cookie';
import { useRouter } from 'next/router';

export default function AccountNav({toggleNav}){
    const [authState, setAuthState] = useState(false);
    const [cookies, removeCookie] = useCookies(['abreakmusic_isloggedin']);
    const router = useRouter();
    
    useEffect(() => {
        if(cookies['abreakmusic_isloggedin'] == "true"){
            setAuthState(true);
        }else {
            setAuthState(false);
        }
    }, [cookies])

    const handleLogout = () => {
        const login = fetch("../api/logout", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(null)
        }).then((res) => res.json())
        .then((data) => {
            setAuthState(false);
            removeCookie('abreakmusic_isloggedin');
            router.push("/");
        });
    }

    return(
        
        <div className="account-nav bg-purple-900 lg:bg-transparent flex items-stretch h-[70px] lg:h-full lg:w-[30%]">
            <Link href="/" className="w-[20%] p-2 lg:hidden">
                <img src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2023/03/abreak-logo-ALL-WHITE-TEXT.png`} />
            </Link>
            {authState == false ? (
                <>
                    <Link className="w-[40%] px-2 md:px-2 lg:w-[50%] text-center bg-amber-400 items-center justify-center flex flex-col md:flex" href="/register"><button >register & upload</button></Link>
                    <Link className="w-[25%] lg:w-[50%] text-center bg-cyan-500 text-white items-center justify-center flex" href="/login"><button>login</button></Link>
                </>
            ):(
                <>
                    <Link className="w-[40%] lg:w-[50%] text-center bg-amber-400 items-center justify-center flex flex-col md:flex-row" href="/dashboard" as={`/dashboard`}><button className="block flex justify-center items-center" type="button" >dashboard</button></Link>
                    <button className="w-[25%] lg:w-[50%] text-center bg-cyan-500 text-white" onClick={handleLogout}>logout</button>
                </>
            )}
            <button onClick={toggleNav} type="button" className="w-[15%] lg:hidden text-center text-white flex items-center justify-center"><FaBars/></button>
        </div>
    )

}