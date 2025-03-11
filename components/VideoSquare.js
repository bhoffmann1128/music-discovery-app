import styles from "../styles/SquareVideo.module.css"
import {FaPlay, FaStop} from "react-icons/fa"
import { useEffect, useRef, useState } from "react";

export default function VideoSquare({posterImg, videoUrl}){

    const videoRef = useRef(null);
    const posterImgRef = useRef(null);
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [showPosterImg, setShowPosterImg] = useState(true);
    const [videoStatus, setVideoStatus] = useState({
        isPlaying:false,
    });

    const handleVideoClick = () => {
        videoRef.current?.play();
        setVideoPlaying(false);
        videoStatus.isPlaying
        ? videoRef.current.pause()
        : videoRef.current.play();

        setShowPosterImg(false);
    }
    
    return (
        <div className={styles.squareVideo} >
            
            <div className={showPosterImg == false ? styles.abreakPoptextAnimate : styles.abreakPoptext}></div>
           

                {showPosterImg && (
                    <>
                     <div className={styles.squareBlackBackground}></div>
                    <img ref={posterImgRef} className={styles.posterImg} src={posterImg} />
                    </>
                )}
                <video 
                    ref={videoRef} 
                    className={styles.abreakSquareVideo}  
                    poster={posterImg} playsInline disablePictureInPicture 
                    preload="metadata"
                    onPlay={() => setVideoStatus({ ...videoStatus, isPlaying: true })}
                    onPause={() => setVideoStatus({ ...videoStatus, isPlaying: false })}
                >
                        <source src={videoUrl} type="video/mp4" />
                </video>

            <button className={styles.squareVideoBtn} onClick={handleVideoClick}>
                {videoStatus.isPlaying == true ? <FaStop />:<FaPlay /> }
            </button>
            
        </div>
    )
}