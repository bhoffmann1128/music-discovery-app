import styles from "../styles/CircleImage.module.css"

export default function ArtistVideoCircleImage({imgSrc, type}){

    const backgroundImage = "url(" + imgSrc + ")";
    
    return (
        <div className={styles.circleItem + " " + styles["type-artistvideo"]}>
            <div className={styles.circleAbreak}></div>
            <div className={styles.circleArtistimg}>
                <div className={styles.artistimgInner} style={{backgroundImage}}>
                </div>
            </div>
        </div>
    )
}