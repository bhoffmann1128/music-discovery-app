import { useEffect, useLayoutEffect } from "react";
import PlaylistSongPlayer from "./playlistSongPlayer"

export default function NewAdds({playlistData, positionData}){

    const handleVoteClick = (songid) => {
        console.log("handling vote click:", songid);
    }
    
    const finalArr = playlistData.playlistSongs.map(obj => {
        const index = positionData.findIndex(el => el["songid"] == obj["songid"]);
        const { positions } = index !== -1 ? positionData[index] : {};
        
        let posArr = positions.split(", ");
        let debut = posArr.length == 1;
        
            return {
            ...obj,
            positions,
            debut
            };
        
     });
    
    return (

        <div className="py-6">
            {finalArr.map((song) => (
                song.debut ?
                <PlaylistSongPlayer 
                    key={song.songid}
                    songdata={song}
                    voteClick={handleVoteClick}
                    playlistCategory={1}
                /> : null
                
            ))}
        </div>
        
    )
}