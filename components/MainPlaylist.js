import { useState } from "react";
import PlaylistSongPlayer from "./playlistSongPlayer"
import Moment from 'react-moment';

export default function MainPlaylist({playlistData, positionData}){

    const [currentPlaylistDate, setCurretPlaylistDate] = useState(playlistData.playlistInfo.week);
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
            <div className="font-bold text-center">
                <div>playlist for <Moment format="M/DD/YYYY">{currentPlaylistDate}</Moment></div>
                <div className="text-slate-500">next playlist <Moment add={{ weeks: 2 }}  format="M/DD/YYYY">{currentPlaylistDate}</Moment></div>
               {/* <div className="text-slate-500">next playlist 12/07/2023</div> */}
            </div>
            {finalArr.map((song,i) => (
                <PlaylistSongPlayer 
                    key={i}
                    songdata={song}
                    playlistCategory={1}
                />
                
            ))}
        </div>
        
    )
}