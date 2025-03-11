import styles from "../styles/CircleImage.module.css"

export default function CircleImage({imgSrc, type, debut=false}){

    const backgroundImage = "url(" + imgSrc + ")";
    
    return (
        <div className={styles.circleItem + " " + styles["type-" + type]}>
            {debut && (
                <h3 className="playlist-debut-abs">debut</h3>
            )}
            <div className={styles.circleAbreak}></div>
            <div className={styles.circleArtistimg}>
                <div className={styles.artistimgInner} style={{backgroundImage}}>
                </div>
            </div>
        </div>
    )
}