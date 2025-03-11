import Link from 'next/link'
import CircleImage from '../components/circleImage'
import {FaUser} from 'react-icons/fa'
import {SiAudiomack} from 'react-icons/si'
import {BsGear} from 'react-icons/bs'
import SocialIcons from '../components/socialIcons'
import { useRouter } from 'next/router'

export default function DashboardTop({props}){

    function NavLink({to, children}) {
        const router = useRouter();
        let classStr = 'purple-button inline-flex';    
        
        if(router.pathname == to){
            classStr += ' active';
        }
    
        return <Link href={to} className={classStr}>
            {children}
        </Link>
      }

    return(
        <>
        <div className="dashboard-top w-full px-6 md:flex items-center md:items-stretch pt-8 md:pl-5 md:pr-8">
            <div className="md:w-[50%] dashboard-left flex-col md:flex md:flex-row justify-center md:justify-start items-center md:pl-2">
                <CircleImage type={"dashboard"} imgSrc={process.env.NEXT_PUBLIC_CLOUDFRONT_BASE + props.data.artistimage} />
                <div className="mt-6 mb-6 text-center md:text-left md:mt-0 md:mb-0 artist-meta text-xs">
                    <h2 className="blue-shadow text-3xl">{props.data.artistname}</h2>
                    <p>{props.data.email}</p>
                    <p>{props.data.city + ", " + props.data.state + " " + props.data.country}</p>
                    
                    <div className="profile-genre-list">
                        {props.data.genre && props.data.genre.split(",").map((genreItem) => (
                        <span className="pr-1" key={genreItem}>
                            {props.genres.find(item => item.id == genreItem).genre}  
                        </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="md:w-[50%] dashboard-right text-center text-[14px]">
                <span className="tip"><strong>note</strong></span>
                <p className="leading-5 mb-2">social media is a way for us to get to know more about you. the number of followers you have is not important to us. what we are looking for is passion and growth, in whatever form(s) - be it from you, your fans, whoever/however.</p>
                <p><strong>we are following indie artists on the following platforms.</strong></p>
                <SocialIcons theme="light" />
            </div>
        </div>
        <div className="dashboard-menu md:flex items-center mt-5">
            <NavLink to="/dashboard"><SiAudiomack />&nbsp;&nbsp;my songs</NavLink>
            <NavLink to="/profile/editProfile"><FaUser />&nbsp;&nbsp;edit profile</NavLink>
            {process.env.NEXT_PUBLIC_PREMIUM == "true" && (<NavLink to="/profile/editAccount"><BsGear />&nbsp;&nbsp;edit account</NavLink>) }
        </div>
        <div className="dashboard-middle"></div>
        </>
    )
}