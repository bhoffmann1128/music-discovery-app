import { useEffect, useLayoutEffect } from "react";
import PlaylistSongPlayer from "./playlistSongPlayer"

export default function SpikedInPlaylist({playlistData}){

    const handleVoteClick = (songid) => {
        console.log("handling vote click:", songid);
    }
    
    return (

        <div className="py-6">
            {playlistData.playlistSongs && playlistData.playlistSongs.map((song) => (

                <PlaylistSongPlayer 
                    key={song.songid}
                    songdata={song}
                    playlistCategory={3}
                /> 
                
            ))}
        </div>
        
    )
}