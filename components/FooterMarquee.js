import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion";

export default function FooterMarquee() {


    const [seconds, setSeconds] = useState(0);
    const [listContent, setListContent] = useState([
        "we’re just getting started (you have no idea)",
		"we’re 100% free - u keep your copyrights",
		"see why we’ve walked the walk",
		"see who we’re connected with"
    ]);
    const [listItem, setListItem] = useState(listContent[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            if(seconds < listContent.length - 1){
                setSeconds((seconds) => seconds+1);
            }else {
                setSeconds((seconds) => 0);
            }
            if(listContent[seconds]){
                setListItem(listContent[seconds]);
            }
        }, 2000);
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
                className="footer-marquee w-full text-center md:text-left fixed md:absolute bottom-0 left-0 md:w-auto px-6 py-2 bg-violet-800 text-white md:text-black md:bg-white z-10"
            >
                <h3 className="text-[20px] text-white md:text-slate-700 p-0 m-0 italic">{listItem}</h3>
            </motion.div>
        </AnimatePresence>
        </>
    )
}