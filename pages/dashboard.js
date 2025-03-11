import FullWidthLayout from '../components/fullWIdthLayout'
import cookie from 'cookie'
import {FaPlus} from 'react-icons/fa'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import ErrorModal from '../components/errorModal'
import SongEditModal from '../components/songEditModal'
import uuid from 'react-uuid'
import UploadProgressModal from '../components/uploadProgressModal'
import DashboardTop from '../components/dashboardTop'
import DashboardSongPlayer from '../components/dashboardSongPlayer'
import ConfirmationModal from '../components/confirmationModal'
import parse from 'html-react-parser'
import { useRouter } from 'next/router'
import { Reorder } from "framer-motion"
import { AudioProvider } from '../components/audioHandler'
import { getArtistProfile } from './api/getArtistProfile'
import { getArtistAccount } from './api/getArtistAccount'
import {clearCookies} from './api/logout'
import { getGenres } from './api/getGenres'

export async function getServerSideProps(context) {
  let userInfo = cookie.parse(context.req.headers.cookie);
  let senddata = {};
  senddata.token = userInfo.abreakmusic_token;
  senddata.username = userInfo.abreakmusic_username;
  senddata.action = "get";
  senddata.role = "artist";
  
  /*const login = await fetch(`${process.env.APP_URL}/api/getArtistProfile`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
      body: JSON.stringify(senddata)
  });
  const artistdata = await login.json();*/
  const artistdata = await getArtistProfile(senddata);

  if(!artistdata || artistdata.status == "ERROR"){
    console.log("ERROR");
    //await fetch(`${process.env.APP_URL}/api/logout`);
    clearCookies();
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props:{},
    };
  }

  if(artistdata.results[0].hasEmptyProfile == true){
    return {
      redirect: {
        permanent: false,
        destination: "/profile/stepForm",
      },
      props:{},
    };
  };

  const artistAccountData = await getArtistAccount(senddata);
  const genreResult = await getGenres();

  return {
    props: {data: artistdata.results[0], username: userInfo.abreakmusic_username, genres: genreResult, account: artistAccountData}, // will be passed to the page component as props
  }
}

export default function Page(props) {

  const inputFile = useRef(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorContent, setErrorContent] = useState(null);
  const [showSongEditModal, setShowSongEditModal] = useState(false);
  const [songEditInfo, setSongEditInfo] = useState(null);
  const [showUploadProgressModal, setShowUploadProgressModal] = useState(false);
  const [presignedUrl, setPresignedUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [songLimit, setSongLimit] = useState(2);
  const [placeholderTotal, setPlaceholderTotal] = useState(2);
  const [premiumService, setPremiumService] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [songToDelete, setSongToDelete] = useState(null);
  const [artistSongs, setArtistSongs] = useState(props.data.songs);
  const [prevArtistSongs, setPrevArtistSongs] = useState(props.data.songs);
  const [savingOrder, setSavingOrder] = useState(false);

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }

  useEffect(()=> {
    if(props.account.length){
      setPremiumService(true);
      setSongLimit(4);
    }
    if(artistSongs){
      let pTotal = songLimit - artistSongs.length;
      setPlaceholderTotal(pTotal);
    }else {
      setPlaceholderTotal(songLimit);
    }
    
  }, [props, songLimit, artistSongs])

  const handleAddSongClick = () => {
    inputFile.current.click();
  }

  const checkFileType = async(songfile) => {
    
    const upload = await fetch("../api/checkUploadFileType", {
      method: 'post',
      /*headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),*/
      body: songfile
    }).then((res) => res.json())
    .then(async (data) => {
      console.log("DATA", data);
      return data;
    });
  }

  const checkMime = (bytes, mime) => {
    console.log("BTM", bytes, mime);
      for (var i = 0, l = mime.mask.length; i < l; ++i) {
        console.log("bytes", bytes[i]);
          if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
              return false;
          }
      }
      return true;
    
  }

  
  const fileChangeHandler = async(e) => {
    let file_size = e.target.files[0].size;
    let file_name = e.target.files[0].name;
    let file_type = e.target.files[0].type;
    let fileObject = e.target.files[0];

    /*console.log("type", e.target.files[0].slice(0,4));

    var mimes = [
      {
          mime: 'audio/mpeg',
          pattern: [0x49, 0x44, 0x33],
          mask: [0xFF, 0xFF, 0xFF],
      }
      // you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
  ];

    let blob = e.target.files[0].slice(0,4);
    var reader = new FileReader();
    reader.onloadend = function(e) {
        if (e.target.readyState === FileReader.DONE) {
            var bytes = new Uint8Array(e.target.result);

            for (var i=0, l = mimes.length; i<l; ++i) {
              
                if (checkMime(bytes, mimes[i])) 
                  console.log("Mime: " + mimes[i].mime + " <br> Browser:" + file.type);
            }

            console.log( "Mime: unknown <br> Browser:" + file.type);
        }
    };
    reader.readAsArrayBuffer(blob);

    return false; */

    let errorContent = null;
    if(file_size > 20000000){
      errorContent = {
        statuscode: "ABREAK104",
        message: "file too large"
      }
      setErrorContent(errorContent);
      setShowErrorModal(true);
    }
    if(file_type != "audio/mpeg"){
      errorContent = {
        statuscode: "ABREAK105",
        message: "file must be an .mp3"
      }
      setErrorContent(errorContent);
      setShowErrorModal(true);
    }
    
    if(errorContent == null){
      
      let songInfo = {
        filename: file_name,
        filetype: file_type,
        file: fileObject
      }

      prepSongUpload(fileObject);
      //setSongEditInfo(songInfo);
      //setShowSongEditModal(true);
    }
  }

  const prepSongUpload = (fileObject) => {

    setShowUploadProgressModal(true);
    let rid = uuid();
    let file = fileObject;
    let songname = fileObject.name;
    let ext = ".mp3";
    
    let filename = rid + '.' + ext;
    let username = props.username;
    let key = 'artists/' + username + '/songs/' + rid;
    let artistname = props.data.artistname;
    let artistid = props.data.id;
    
    var uploadParams = {
        Key: key,
        ContentType: file.type,
        Bucket: "abreak",
        acl: 'public-read',
        Metadata: {
          "songname": encodeURIComponent(songname),
          "artistname": String(artistname),
          "username": String(username),
          "artistid": String(artistid)
        },
        Body: fileObject
    }
    let senddata = {
      id: rid,
      metadata: uploadParams.Metadata,
      artistname: artistname,
      filename: filename,
      songname: songname,
      key: key
    }
    
    const upload = fetch("../api/getPresignedSongUrl", {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
      body: JSON.stringify(senddata)
    }).then((res) => res.json())
    .then(async (data) => {
        setPresignedUrl(data.result);
        uploadSong(data.result, fileObject, senddata).then(function(result){
          setLoadingMsg(true);
          //record results in database here
          recordSongData(senddata);
        });
    });
  }

  const recordSongData = (senddata) => {
    const record = fetch("../api/addSongToDB", {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
      body: JSON.stringify(senddata)
    }).then((res) => res.json())
    .then(async (data) => {
        //console.log("add song to db result", data);
        senddata.songid = data.data.results.insertId;
        setLoadingMsg(false);
        setSongEditInfo(senddata);
        setShowSongEditModal(true);
    });
  }

  const uploadSong = async(url, fileObject, senddata) => { 

      setShowUploadProgressModal(true);
      const result = await new Promise((resolve,reject) => {

        var xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);
        xhr.setRequestHeader("x-amz-meta-songname", encodeURIComponent(senddata.songname));
        xhr.setRequestHeader("x-amz-meta-artistname", String(senddata.artistname));
        xhr.setRequestHeader("x-amz-meta-username", String(props.username));
        xhr.setRequestHeader("x-amz-meta-artistid", String(props.artistid));

        xhr.onload = (e) => {
          let resultData = {
            key: senddata.key
          }
          resolve(resultData);
          if (xhr.status === 200) {
            console.log('Uploaded data successfully');
          }
        };
        
        xhr.upload.addEventListener('progress', function(e){
          var progPct = Math.round((e.loaded/e.total) * 100);
            setUploadProgress(progPct);
            if(progPct == 100){
              setShowUploadProgressModal(false);
              setUploadProgress(0);
            }
        }, false);
        
        xhr.onerror = () => {
          reject('error in file upload');
        };
        xhr.send(fileObject);
    });

    return result;
    
  }

  const getSongDetails = (songid) => {
      return fetch("../api/getSongInfo", {
          method: 'post',
          headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          }),
          body: JSON.stringify({songid: songid})
      }).then((res) => res.json())
      .then(async (data) => {
          return data;
      });
  }

  const songEditClick = async (songid) => {
    setLoadingMsg(true);
    let songDetails = await getSongDetails(songid);
    songDetails.data.results.songid = songid;
    setSongEditInfo(songDetails.data.results);
    setShowSongEditModal(true);
    setLoadingMsg(false);
  }

  const findSongById = (id) => {
    let song = props.data.songs.find(s=>s.id ===id);
    return song;
  }

  const handleSongDelete = (songid) => {
    setSongToDelete(songid);
    let songInfo = findSongById(songid);
    let confMessage = parse("delete your song '<em>" + songInfo.songname + "</em>' ?");
    setConfirmationMessage(confMessage);
    setShowConfirmationModal(true);
  }

  const handleConfirmDelete = async() => {
    setLoadingMsg(true);
    const deleteSongFetch = await fetch("../api/deleteSong", {
      method: 'post',
      headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      }),
      body: JSON.stringify({songid: songToDelete})
    }).then((res) => res.json())
    .then(async (data) => {
      setLoadingMsg(false);
      setShowConfirmationModal(false);
      refetchSongData();
    });
  }

  const refetchSongData = async() => {
    setLoadingMsg(true);
    let senddata = {};
    senddata.action = "get";
    senddata.role = "artist";
    const getArtistData = await fetch(`../api/getArtistProfile`, {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify(senddata)
    });
    const artistdata = await getArtistData.json();
    setLoadingMsg(false);
    setArtistSongs(artistdata.data.results[0].songs);
  }

  const handleSongEditSave = () => {
    refetchSongData();
    setShowSongEditModal(false);
  }

  //on reorder - 
  //check if order is the same
  //record new order in database
  useEffect(() => {
    
    if(JSON.stringify(prevArtistSongs) == JSON.stringify(artistSongs)){
      //order matches
    }else {
      //order doesn't match
      let songOrder = [];
      let songIndex = 1;
      artistSongs.forEach((song) => {
        songOrder.push(song.id);
        songIndex++;
      });
      recordSongOrder(songOrder);
      setPrevArtistSongs(artistSongs);
    }
    
  }, [artistSongs])

  const recordSongOrder = async(orderArr) => {
    setSavingOrder(true);
    let senddata = {
      order: orderArr
    }
    const reorderSongData = await fetch(`../api/updateSongOrder`, {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify(senddata)
    });
    const result = await reorderSongData.json();
    setSavingOrder(false);

  }

  
    return (
        <div className="w-full">

            {loadingMsg==true &&
                <div className="fixed z-[9999] top-0 left-0 text-center flex justify-center items-center w-screen h-screen bg-white/75">
                    <img src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2022/01/abreak-loading-animation-white.svg`} width="100" height="auto"/>
                </div>
            }
            <DashboardTop props={props}></DashboardTop>
            <div className="dashboard-bottom">
              <div className="px-10 py-2 relative">
                
                <h2 className="blue-shadow text-3xl">my top songs</h2>
                {premiumService == true ? (
                  <p><em>4 songs max</em></p>
                ):(
                  <p><em>2 songs max</em></p>
                )}
                <div className="text-right absolute bottom-5 left-0 md:w-[60%] text-slate-400">
                  {savingOrder && (
                    <p><em>saving order...</em></p>
                  )}
                </div>
              </div>
              <div className="md:flex items-start">
                <div className="song-holder md:w-[70%] px-4 md:px-10">
                  {artistSongs && (
                    <Reorder.Group values={artistSongs} onReorder={setArtistSongs}>
                      {artistSongs.map((song, index) => (
                        <Reorder.Item key={song.id} value={song}>
                          <DashboardSongPlayer 
                            key={song.id} 
                            orderIndex = {index}
                            order={song.order}
                            location={song.location}
                            songname={song.songname}
                            songid={song.id}
                            songData={song}
                            songEditClick={songEditClick} 
                            songDeleteClick={handleSongDelete} 
                            premium={premiumService}>
                          </DashboardSongPlayer>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )}
                  {Array(Math.max(0, Math.floor(placeholderTotal))).fill(0).map((e,i) => (
                    <button key={"placeholder-" + i} onClick={handleAddSongClick} className="placeholder-song"><FaPlus />add new song</button>
                  ))}
                    <input type='file' id='file' ref={inputFile} onChange={fileChangeHandler} style={{display: 'none'}}/>
                </div>
                <div className="md:w-[30%] mt-4 md:mt-0 px-10 md:pl-2 md:pr-20">
                  <p className="leading-4"><small><em>songs will be reviewed by our human a&r team for airplay and the aBreak58 playlist. There will be an updated playlist every two weeks. songs will remain eligible until you remove them. we notice when you send us new music.</em></small></p>
                </div>
              </div>
            </div>

            <ErrorModal
                onClose={() => setShowErrorModal(false)}
                show={showErrorModal}
                content={errorContent}
            ></ErrorModal>
            <SongEditModal
              onClose={() => setShowSongEditModal(false)}
              show={showSongEditModal}
              songInfo={songEditInfo}
              genres={props.genres}
              onSave={handleSongEditSave}
              loading={()=>setLoadingMsg(false)}
            ></SongEditModal>
            <UploadProgressModal
              onClose={() => setShowUploadProgressModal(false)}
              show={showUploadProgressModal}
              progress={uploadProgress}
            ></UploadProgressModal>
            <ConfirmationModal
              onClose={() => setShowConfirmationModal(false)}
              show={showConfirmationModal}
              message={confirmationMessage}
              onCancel={()=> setShowConfirmationModal(false)}
              onSubmit={()=>handleConfirmDelete()}
            ></ConfirmationModal>
            
        </div>
    )
}