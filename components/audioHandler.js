import { createContext, useContext, useState } from 'react';

//We first create a store
export const AudioContext = createContext();
export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context && typeof window !== 'undefined') {
        throw new Error(`useAudio must be used within a AudioContext `);
    }
    return context;
};

//Then we create the provider
export const AudioProvider = ({ children }) => {

    const [ song, _setSong ] = useState();
    const [radioOn, setRadioOn] = useState(false);
    const [playlistSongOn, setPlaylistSongOn] = useState(false);

    const setSong = (newSong, radio=false, playlistSong = true) => {

          if(song){
            // if it's a playlist song, and the playlist song is playing, then pause the song
            // if it's a playlist song, and the radio is playing, then pause the radio and play the playlist song
            // if it's a playlist song, and the radio is paused and the playlist song is not playing, then play the playlist song
            // if it's the radio, and the radio is paused, then don't do anything (will play automatically)
            // it it's the raio, and the radio is playing, then play the radio and pause the playlist song
            if(playlistSongOn){
              song.pause();
            }
            if(radioOn){
              song.pause();
            }
            
          }
          
          if(radio == false && playlistSong == true){
            newSong.play();
          }

          if(playlistSong == true){
            setPlaylistSongOn(true);
          }else {
            setPlaylistSongOn(false);
          }

          if(radio == true){
            setRadioOn(true);
          }else {
            setRadioOn(false);
          }
          
          _setSong(newSong);
    }

    const pauseSong = () => song.pause();
    return <AudioContext.Provider value={{ setSong, pauseSong }}>{children}</AudioContext.Provider>
}