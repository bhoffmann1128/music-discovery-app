import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion";
import "@fontsource/permanent-marker"

export default function DataCarousel({listArray}) {

    
    const [seconds, setSeconds] = useState(1);
    const [listContent, setListContent] = useState(listArray);
    const [listItem, setListItem] = useState(listContent[0].artist_name);
    

    useEffect(() => {
        const interval = setInterval(() => {
            if(seconds < listContent.length - 1){
                setSeconds((seconds) => seconds+1);
            }else {
                setSeconds((seconds) => 0);
            }
            if(listContent[seconds]){
                setListItem(listContent[seconds].artist_name);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [seconds]);

    return (
        <>
        <AnimatePresence exitBeforeEnter>
            <motion.div
                initial={{opacity:0}}
                animate = {{opacity: 1, transition:{duration: 0.5}}}
                exit={{opacity: 0 }}
                style={{ fontSize: 100 }}
                key={seconds}
                className="animated-list text-center"
            >
                <h2>{listItem}</h2>
            </motion.div>
        </AnimatePresence>
        </>
    )
}