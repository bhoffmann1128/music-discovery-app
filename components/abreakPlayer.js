import {useEffect, useRef, useState} from 'react';
import { IconContext } from 'react-icons';
import {FaPlay, FaStop} from 'react-icons/fa';
import {useAudio} from '../components/audioHandler'
import {motion} from "framer-motion"


export default function AbreakPlayer(){

    const [status, setStatus] = useState({
        isPlaying:false,
        error:false,
        event: "init"
    });
    const [meta, setMeta] = useState({
        artist: null,
        song: null
    });
    const [check, setCheck] = useState(0)
    const [voteButton, setVoteButton] = useState(false);
    const [scrollText, setScrollText] = useState(false);
    const [textScrollWidth, setTextScrollWidth] = useState([0,-500]);
    const [showRadioCallout, setShowRadioCallout] = useState(true);

    const { setSong, pauseSong } = useAudio();
    const songnameRef = useRef(null);

    const audioRef = useRef();
    const handleAudioClick = () => {
        
        status.isPlaying
        ? audioRef.current.pause()
        : audioRef.current.play();
        
        

        //if radio wasn't playing before, it's playing now, set audio handler to radio playing.
        //!status.isPlaying ? setSong(audioRef.current, true, false) : null;
        !status.isPlaying ? setSong(audioRef.current, true, false) : setSong(audioRef.current, false, false);
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

    const handleRadioVote = () => {
        let voteData = {
            artist: meta.artist,
            song: meta.song,
            songid: null,
            type: "radio",
            vote: 1
        };
        const playlistRes = fetch("../api/vote", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(voteData)
        }).then((res) => res.json())
        .then((data) => {
            setVoteButton(true);
        });

    }

    const getTextWidth = (text, font) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        context.font = font || getComputedStyle(document.body).font;
        context.font = "22px Comfortaa";
        //console.log(context);
       // context.font = "Comfortaa";
        return context.measureText(text).width;
      }

    const getRadioMeta = () => {

        try {
            fetch('https://api.live365.com/station/a33750')
            .then((response) => response.json())
            .then(async (response) => {
                var track = response['current-track'];
                setMeta({artist: track.artist, song: track.title });
            });
        } catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        const id = setInterval(() => {
            getRadioMeta();
            setCheck(check+1);
        }, 3000);
        return () => clearInterval(id);
    }, [check])

    useEffect(() => {
        if(songnameRef.current){
            let textWidth = getTextWidth(songnameRef.current?.innerText);
            let clientWidth = songnameRef.current?.clientWidth;
            setTextScrollWidth([0, -textWidth]);
            if(textWidth > clientWidth -25 ){
                setScrollText(true);
            }else {
                setScrollText(false);
            }
        }
        
    }, [meta]);

    useEffect(() => {
        //console.log("effect status", status);
        status.isPlaying ? setShowRadioCallout(false) : setShowRadioCallout(true);
    }, [status])


    return (
        
        <div className="h-[70px] lg:w-[70%] abreak-player flex items-center">
            <div className="onair">
		        <h2>
                    <span>O</span>
                    <span>N</span> 
                    <span>A</span>
                    <span>I</span>
                    <span>R</span>
                </h2>
	        </div>
            <button className="radio-button" onClick={()=>handleAudioClick()}>
                <img src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2021/07/abreak-circle-centered.png`} className="radio-button-circle" />
                <IconContext.Provider value={{color: 'white', size: '25px'}}>
                    {status.isPlaying ? <FaStop className="radio-button-stop" /> : <FaPlay />}
                </IconContext.Provider>
            </button>
            <div className="radio-meta whitespace-nowrap overflow-hidden">
                <h3>{meta.artist}</h3>
                {scrollText == true ? (
                <motion.div
                        className="track"
                        variants={marqueeVariants}
                        animate="animate"
                    >
                    <h2 ref={songnameRef}>{meta.song ? (`${meta.song}`) : ( <span className="text-sky-200">loading</span>)}</h2>
                </motion.div>
                ):(
                    <h2 ref={songnameRef}>{meta.song ? (`${meta.song}`) : ( <span className="text-sky-200">loading</span>)}</h2>
                )}
            </div>
            <div className="radio-vote text-center mr-2">
                
                <button className="radio-vote-button" onClick={handleRadioVote}>
                    {voteButton ?  <img className="w-[50px] py-10" src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2022/01/abreak-thumbs-up-active.png`} /> : <img className="w-[50px] py-10" src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2021/12/abreak-thumbs-up.png`} /> }
                </button>
            </div>
            <div className="radio-promo">
                <div className="radio-promo-inner">
                    <a target="_blank" rel="noreferrer" className="live365Logo" href="https://live365.com/station/aBreak-music-a33750"></a>
                    <a target="_blank" rel="noreferrer" className="iheartLogo" href="https://www.iheart.com/"></a>
                </div>
            </div>
            <audio
                id="abreakRadio"
                ref={audioRef}
                src="https://streaming.live365.com/a33750?listenerId=Live365-Widget-AdBlock&aw_0_1st.playerid=Live365-Widget&aw_0_1st.skey=1628870072"
                onLoad={() => setStatus({ ...status, isLoaded: true, event: "loaded" })}
                onPlay={() => setStatus({ ...status, isPlaying: true, event: "play" })}
                onPause={() => setStatus({ ...status, isPlaying: false, event: "pause" })}
                onError={() => setStatus({ ...status, error: true, event: "error" })}
             >
            </audio>
            {showRadioCallout && (
            <div className="radio-callout">
                <div className="radio-callout-corner"></div>
                <div className="radio-callout-inner">aBreak58 radio, playing the best indie music, live 24/7</div>
            </div>
            )}
        </div>
       
    )
}