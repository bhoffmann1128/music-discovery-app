import {FaInstagramSquare, FaTiktok, FaFacebook, FaTwitter} from "react-icons/fa"
import TwitterXLogo from "./twitterXLogo"


export default function SocialIcons({theme}){
    
    return (
        <div className={"pt-4 theme-" + theme}>
            <div className={"social-icons flex items-center justify-evenly theme-" + theme}>
                <a rel="noreferrer" href="https://www.instagram.com/abreakmusic/" target="_blank"><FaInstagramSquare /></a>
                <a rel="noreferrer" href="https://www.tiktok.com/@abreakmusic" target="_blank"><FaTiktok /></a>
                <a rel="noreferrer" href="https://www.facebook.com/aBreak-Music-100387959179858/" target="_blank"><FaFacebook /></a>
                { /* <a rel="noreferrer" href="https://twitter.com/abreakmusic" target="_blank"><FaTwitter /></a> */ }
                
                <a rel="noreferrer" className="twitterX" href="https://twitter.com/abreakmusic" target="_blank">
                    <TwitterXLogo />
                </a>

            </div>
        </div>
    )
}