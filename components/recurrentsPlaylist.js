import { useEffect, useLayoutEffect, useState } from "react"
import PlaylistSongPlayer from "./playlistSongPlayer"
import Moment from 'react-moment'

export default function RecurrentsPlaylist({playlistData}){

    const [currentPlaylistDate, setCurretPlaylistDate] = useState(playlistData.playlistInfo ? playlistData.playlistInfo.week : null);

    const handleVoteClick = (songid) => {
        console.log("handling vote click:", songid);
    }
    
    return (

        <div className="py-6">
            <div className="font-bold text-center">
                <div>playlist for <Moment format="M/DD/YYYY">{currentPlaylistDate}</Moment></div>
                <div className="text-slate-500">next playlist <Moment add={{ weeks: 2 }}  format="M/DD/YYYY">{currentPlaylistDate}</Moment></div>
                { /* <div className="text-slate-500">next playlist 12/207/2023</div> */ }
            </div>
            {playlistData && playlistData.playlistSongs && playlistData.playlistSongs.map((song) => (

                <PlaylistSongPlayer 
                    key={song.songid}
                    songdata={song}
                    playlistCategory={4}
                /> 
                
            ))}
        </div>
        
    )
}