import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PlaylistSongPlayer from "./playlistSongPlayer"

export default function ArchivePlaylist({playlistData}){

    const [searchData, setSearchData] = useState(null);
    const [fullPlaylistData, setFullPlaylistData] = useState(playlistData);

    const handleVoteClick = (songid) => {
        console.log("handling vote click:", songid);
    }

    console.log(playlistData);
    const artistSearchInput = useRef(null);
    const songSearchInput = useRef(null);

    const filterPlaylist = () => {
        let artistSearch = artistSearchInput.current?.value;
        let songSearch = songSearchInput.current?.value;
        console.log(artistSearch, songSearch);

        const filteredData = fullPlaylistData.playlistSongs.filter((song) => song.songname.toLowerCase().includes(songSearch.toLowerCase())).filter((song) => song.artistname.toLowerCase().includes(artistSearch.toLowerCase()));
        console.log("filtered", filteredData);
        setSearchData(filteredData);
    }

    return (

        <div className="py-6">

            <div className="flex items-center bg-slate-100 py-4">
                <div className="w-[50%] px-2">
                    <h3><em>search by artist</em></h3>
                    <input ref={artistSearchInput} onChange={filterPlaylist} className="px-2 py-2 border border-2 border-slate-300 w-full"></input>
                </div>
                <div className="w-[50%] px-2">
                    <h3><em>search by song</em></h3>
                    <input ref={songSearchInput} onChange={filterPlaylist} className="px-2 py-2 border border-2 border-slate-300 w-full"></input>
                </div>
            </div>

            {searchData && (
                <>
                {searchData.map((song) => (

                    <PlaylistSongPlayer 
                        key={song.songid}
                        songdata={song}
                        playlistCategory={2}
                    /> 
                    
                ))}
                </>
            )}

            {!searchData && (
                <>
                {playlistData.playlistSongs && playlistData.playlistSongs.map((song) => (

                    <PlaylistSongPlayer 
                        key={song.songid}
                        songdata={song}
                        playlistCategory={2}
                    /> 
                    
                ))}
                </>
            )}
        </div>
        
    )
}