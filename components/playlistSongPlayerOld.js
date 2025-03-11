import { useEffect, useRef, useState } from 'react';
import {FaPlay, FaStop, FaRegThumbsUp, FaThumbsUp} from 'react-icons/fa'
import CircleImage from './circleImage';
import {useAudio} from '../components/audioHandler'
import {motion} from "framer-motion"

export default function PlaylistSongPlayerOld({songdata}){

    const [songPlaying, setSongPlaying] = useState(false);
    const [voted, setVoted] = useState(false);
    const [textScrollWidth, setTextScrollWidth] = useState([0,-300]);
    const [artistTextScrollWidth, setArtistTextScrollWidth] = useState([0,-300]);
    const [scrollText, setScrollText] = useState(false);
    const [artistScrollText, setArtistScrollText] = useState(false);


    const { setSong, pauseSong } = useAudio();
    const songnameRef = useRef(null);
    const artistnameRef = useRef(null);
    
    
    
    const musicPlayer = useRef(
        typeof Audio !== "undefined" ? new Audio(process.env.NEXT_PUBLIC_CLOUDFRONT_BASE + songdata.location) : undefined
      );
        
    const playSong = () => {    
        setSong(musicPlayer.current);
        musicPlayer.current?.play();
        setSongPlaying(true);
    }

    const stopSong = () => {
        musicPlayer.current?.pause();
        musicPlayer.current.currentTime = 0;
        setSongPlaying(false);
    }

    const marqueeVariants = {
        animate: {
            x: textScrollWidth,
            transition: {
            x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 5,
                ease: "linear",
            },
            },
        },
    };

    const artistMarqueeVariants = {
        animate: {
            x: artistTextScrollWidth,
            transition: {
            x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 5,
                ease: "linear",
            },
            },
        },
    };

    useEffect(() => {

        if(songnameRef.current){
            let textWidth = getTextWidth(songnameRef.current?.innerText);
            let clientWidth = songnameRef.current?.clientWidth;
            setTextScrollWidth([0, -textWidth]);
            if(textWidth > clientWidth){
                setScrollText(true);
            }
        }

        if(artistnameRef.current){
            let textWidth = getTextWidth(artistnameRef.current?.innerText);
            let clientWidth = artistnameRef.current?.clientWidth;
            setArtistTextScrollWidth([0, -textWidth]);
            if(textWidth > clientWidth){
                setArtistScrollText(true);
            }
        }

        musicPlayer.current.addEventListener("pause", (e) => {
            //setCurrentTime(e.target.currentTime);
            stopSong();
        });
        return () => {
            musicPlayer.current.removeEventListener("pause", () => {});
        };
    }, [])

    const handleVoteClick = async(songInfo) => {
        
        let senddata = {};
        senddata.artist = songInfo.artistname;
        senddata.song = songInfo.songname;
        senddata.songid = songInfo.songid;
        senddata.type = "playlist";
        senddata.vote = 1;

        const vote = await fetch(`../api/vote`, {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(senddata)
        });
        const voteResult = await vote.json();
        setVoted(true);
        
    }

    const getTextWidth = (text, font) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        context.font = font || getComputedStyle(document.body).font;
        return context.measureText(text).width;
      }
    

    return (
        <div className="playlist-song py-6">
            <div className="flex items-center text-center justify-center">
                <span className="blue-shadow text-3xl">{songdata.position}</span>
            </div>
            <div className="debut-column">
                {songdata.debut && (
                    <h3 className="playlist-debut">debut</h3>
                )}
            </div>
            {songdata.imgixSongImg ? (
                <CircleImage
                    type={"playlist"}
                    imgSrc={process.env.NEXT_PUBLIC_IMGIX_URL + songdata.imgixSongImg}
                />
            ):(
                <CircleImage 
                    type={"playlist"}
                    imgSrc={process.env.NEXT_PUBLIC_IMGIX_URL + songdata.imgixImg}
                />
            )}
            <div className="text-left pl-2 pr-2 playlist-songname">
                <motion.div
                    className="track"
                    variants={marqueeVariants}
                    animate="animate"
                >
                    {songdata.corrected_name ? (<h3 ref={songnameRef}>"{songdata.corrected_name}"</h3>): 
                    (<h3 ref={songnameRef}>"{songdata.songname}"</h3>)}
                </motion.div>
                <motion.div
                    className="track"
                    variants={artistMarqueeVariants}
                    animate="animate"
                >
                    <h4 ref={artistnameRef}>{songdata.artistname}</h4>
                </motion.div>
            </div>
            <div className="flex items-center justify-between lg:justify-evenly text-2xl pr-1 lg:pr-4">
                {voted ? (
                    <button type="button" className="ml-2" ><FaThumbsUp /></button>
                ):(
                    <button type="button" className="ml-2" onClick={() => handleVoteClick(songdata)} ><FaRegThumbsUp /></button>
                )}
                {songPlaying == false ? (<button className="playlist-play-btn" onClick={(e) => playSong(songdata.songid)}><FaPlay /></button>): (<button className="playlist-play-btn" onClick={(e) => stopSong(songdata.songid)}><FaStop /></button>)}
            </div>
        </div>
    )
}