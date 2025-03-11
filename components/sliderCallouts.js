import Link from "next/link";
import { Router, useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import {FaChevronUp,FaChevronDown, FaChevronCircleRight} from "react-icons/fa";
import SocialIcons from "../components/socialIcons";

export default function SliderCallouts(){
    const [showPrevButton, setShowPrevButton] = useState(false);
    const [showNextButton, setShowNextButton] = useState(true);
    const sliderRef = useRef(null);
    const sliderParentRef = useRef(null);
    const router = useRouter();

    const handleSlideClick = (e, direction) => {
        e.preventDefault();
        if(direction == "down"){
            sliderRef.current.scrollBy({top:150, behavior:"smooth"});
        }
        if(direction == "up"){
            sliderRef.current.scrollBy({top:-150, behavior:"smooth"});
        }
    }

    const handleSliderScroll = (e) => {
        let scrollTop = sliderRef.current.scrollTop;
        let scrollHeight = sliderRef.current.clientHeight;
        let offsetHeight = sliderParentRef.current.offsetHeight;
        
        if(scrollTop > 0){
            setShowPrevButton(true);
        }else {
            setShowPrevButton(false);
        }

        if(scrollTop > scrollHeight){
            setShowNextButton(false);
        }else {
            setShowNextButton(true);
        }

        
    }

    const handleCalloutClick = (link) => {
        router.push(link);
    }

    return (
        <div ref={sliderParentRef} className="lg:h-[100vh] slider-callouts relative z-0">
            {showPrevButton ? (
                <button className="hidden swiper-button-prev w-full lg:py-4 relative lg:absolute top-0 bg-white z-50 lg:flex items-center justify-center" onClick={(e) => handleSlideClick(e, "up")}>
                    <IconContext.Provider value={{color: '#1ec0e5', size: '50px'}}>
                        <FaChevronUp />
                    </IconContext.Provider>
                </button>
            ) : null}
            
             <div ref={sliderRef} onScroll={handleSliderScroll} className="slider-wrapper h-auto lg:h-[100vh] lg:overflow-y-auto lg:py-5 z-0">
                    <div onClick={()=>handleCalloutClick("abreak58-playlist")} className="callout-slide" >
                        <div className="button-icon"><FaChevronCircleRight /></div>
                        <img className="w-[60%] mb-4" src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2022/01/abreak58-logo-final.png`} height="75px" width="auto" alt="the aBreak58 playlist" title="the aBreak58 playlist" />
                        <p>this is the aBreak58 playlist, featuring the top 58 songs from independent artists representing multiple genres being rotated on our groundbreaking radio station. </p>
                        <div className="divider-purple"></div>
                    </div>
                    <div onClick={()=>handleCalloutClick("this-weeks-adds")} className="callout-slide" >
                        <div className="button-icon"><FaChevronCircleRight /></div>
                        <h3>radio <span>'adds'</span> this week</h3>
                        <div className="divider-purple"></div>
                    </div>
                    {process.env.NEXT_PUBLIC_PREMIUM == "true" && (
                        <div onClick={()=>handleCalloutClick("articles")} className="callout-slide" >
                            <div className="button-icon"><FaChevronCircleRight /></div>
                            <h3>aBreak blitz</h3>
                            <div className="divider-purple"></div>
                        </div>
                    )}
                    <div onClick={()=>handleCalloutClick("wtf-is-abreak")} className="callout-slide" >
                    <div className="button-icon"><FaChevronCircleRight /></div>
                        <h3>wtf is aBreak music?</h3>
                        <p>aBreak music is a free new music and artist discovery platform based in the US – and we’re very different from what you’re used to. the people running and associated with aBreak are some of the most experienced and connected executives in music... </p>
                        <div className="divider-purple"></div>
                    </div>
                    <div onClick={()=>handleCalloutClick("major-connections")} className="callout-slide" >
                        <div className="button-icon"><FaChevronCircleRight /></div>
                        <h3>major connections</h3>
                        <p>we believe the major record label community is in the business of developing and making stars like no one else in music - and you should too...</p>
                        <div className="divider-purple"></div>
                    </div>
                    <div onClick={()=>handleCalloutClick("walking-the-walk")} className="callout-slide" >
                        <div className="button-icon"><FaChevronCircleRight /></div>
                        <h3>walking the walk</h3>
                        <p>just some of the artists those who are building aBreak music have worked with and/or helped to break... </p>
                        <div className="divider-purple"></div>
                    </div>
                    
                    <div onClick={()=>handleCalloutClick("/register")} className="callout-slide" >
                        <div className="social-icons-container">
                            <div className="text-center"><h3>we are following indie artists on the following platforms.</h3></div>
                            <SocialIcons theme="light"></SocialIcons>
                        </div>
                    </div>
                    
                    <div className="callout-slide filler-slide"></div>
            </div>
            {showNextButton ? 
            (
                <button className="hidden swiper-button-next w-full py-4 absolute bottom-[55px] bg-white z-2 lg:flex items-center justify-center" onClick={(e) => handleSlideClick(e, "down")}>
                    <IconContext.Provider value={{color: '#1ec0e5', size: '50px'}}>
                        <FaChevronDown />
                    </IconContext.Provider>
                </button>
            ) : null}
            
		</div>
    )
}