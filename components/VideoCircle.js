import styles from "../styles/CircleVideo.module.css"
import {FaPlay, FaStop} from "react-icons/fa"
import { useEffect, useRef, useState } from "react";

export default function VideoCircle({posterImg, videoUrl, autoPlayVid}){

    const videoRef = useRef(null);
    const posterImgRef = useRef(null);
    const [videoPlaying, setVideoPlaying] = useState(true);
    const [showPosterImg, setShowPosterImg] = useState(posterImg);
    const [videoStatus, setVideoStatus] = useState({
        isPlaying:true,
    });

    const handleVideoClick = () => {
        videoRef.current?.play();
        setVideoPlaying(false);
        videoStatus.isPlaying
        ? videoRef.current.pause()
        : videoRef.current.play();

        setShowPosterImg(false);
    }

    var pathname = new URL(videoUrl).pathname;
    if(pathname == "/web_assets/"){
        
        videoUrl = true;
    }
    
    return (
        <div className={styles.circleVideo} >
            <div className={styles.circleAbreak}></div>
            { <div className={showPosterImg == false ? styles.abreakPoptextAnimate : styles.abreakPoptext}></div> }
           
            
                { showPosterImg && (
                    <>
                     <div className={styles.circleBlackBackground}></div>
                    <img ref={posterImgRef} className={styles.posterImg} src={posterImg} />
                    </>
                ) }

                {videoUrl && (
                    <>
                        <video 
                            ref={videoRef} 
                            className={styles.abreakCircleVideo}  
                            poster={posterImg} playsInline disablePictureInPicture 
                            preload="metadata"
                            onPlay={() => setVideoStatus({ ...videoStatus, isPlaying: true })}
                            onPause={() => setVideoStatus({ ...videoStatus, isPlaying: false })}
                            autoPlay
                            muted
                            loop
                        >
                                {/* <source src="https://abreak.s3.us-east-2.amazonaws.com/web_assets/aBreak_Homepage_Concept_V4.mp4" type="video/mp4" /> */}
                                <source src={videoUrl} type="video/mp4" /> 
                        </video>

                        {autoPlayVid == false ? (
                         <button className={styles.circleVideoBtn + " " + (videoStatus.isPlaying==true ? "btnPlaying" : "btnPaused")} onClick={handleVideoClick}>
                            {videoStatus.isPlaying == true ? <FaStop />:<FaPlay /> }
                        </button>
                        ) : (<></>)}
                    </>
                )}
            
        </div>
    )
}