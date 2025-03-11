import { useEffect, useRef, useState } from 'react';
import {FaPlay, FaStop, FaEdit, FaWindowClose, FaBars} from 'react-icons/fa'
import {useAudio} from '../components/audioHandler'
import {motion} from "framer-motion"

export default function DashboardSongPlayer({songData,orderIndex, order, songid, songname, location, songEditClick, premium, songDeleteClick}){

    const [songPlaying, setSongPlaying] = useState(false);
    const [scrollText, setScrollText] = useState(false);
    const [textScrollWidth, setTextScrollWidth] = useState([0,-500]);
    const { setSong, pauseSong } = useAudio();
    
    
    const songnameRef = useRef();
    const musicPlayer = useRef(
        typeof Audio !== "undefined" ? new Audio(process.env.NEXT_PUBLIC_CLOUDFRONT_BASE + songData.location) : undefined
      );
    
    const marqueeVariants = {
    animate: {
        x: textScrollWidth,
        transition: {
        x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 10,
            ease: "linear",
        },
        },
    },
    };

    const playSong = () => {    
        musicPlayer.current?.play();
        setSong(musicPlayer.current);
        setSongPlaying(true);
    }

    const stopSong = () => {
        musicPlayer.current?.pause();
        musicPlayer.current.currentTime = 0;
        setSongPlaying(false);
    }

    useEffect(() => {
        
        if(songnameRef.current){
            let textWidth = getTextWidth(songnameRef.current?.innerText);
            let clientWidth = songnameRef.current?.clientWidth;
            setTextScrollWidth([0, -textWidth]);
            if(textWidth > clientWidth){
                setScrollText(true);
            }
        }
        
        musicPlayer.current.addEventListener("pause", (e) => {
            //setCurrentTime(e.target.currentTime);
            stopSong();
        });
        return () => {
            musicPlayer.current.removeEventListener("pause", () => {});
        };
    }, []);

    function getTextWidth(text, font) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        context.font = font || getComputedStyle(document.body).font;
        return context.measureText(text).width;
      }

    return (
        <div className="dashboard-song grid grid-cols-4">
            <h3 className="w-[5%]">{orderIndex + 1}</h3>
            <button type="button" className="text-white lg:w-[10%] w-[12%]"><FaBars /></button>
            <div ref={songnameRef} className="w-[50%] lg:w-[60%] whitespace-nowrap overflow-hidden">{scrollText == true ? (
                <div className="scrollText">
                    <motion.div
                        className="track"
                        variants={marqueeVariants}
                        animate="animate"
                    >
                        <h3>{songData.songname}</h3>
                    </motion.div>
                </div>
            ):(<h3>{songname}</h3>)}</div>
            <div className="w-[20%] lg:w-[25%] flex">
                {songPlaying == false ? (<button onClick={(e) => playSong(songData.id)}><FaPlay /></button>): (<button onClick={(e) => stopSong(songData.id)}><FaStop /></button>)}
                <button className="lg:ml-2" onClick={(e) => songEditClick(songData.id)}><FaEdit /></button>
                {premium ||  process.env.NEXT_PUBLIC_PREMIUM == "false" && (
                    <button className="lg:ml-2" onClick={(e) => songDeleteClick(songData.id)}><FaWindowClose /></button>
                )}
            </div>
        </div>
    )
}