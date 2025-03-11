import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceEffect } from '../helpers/useDebounceEffect';
import CropModal from './cropModal';
import {FaAsterisk} from 'react-icons/fa'
import {SiAudiomack} from 'react-icons/si'
import {MdDataSaverOn, MdCancel} from 'react-icons/md'

import { canvasPreview } from '../helpers/canvasPreview';
import uuid from 'react-uuid';

export default function SongEditModal({show, onClose, songInfo, genres, loading, onSave}){
    
    const { register, handleSubmit, watch, getValues, setError, clearErrors, reset, formState: { errors } } = useForm();
    const [imgSrc, setImgSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [showCropModal, setShowCropModal] = useState(false);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [hasSongImage, setHasSongImage] = useState(false);
    const [presignedUrl, setPresignedUrl] = useState(null);
    const [fileKey, setFileKey] = useState(null);
    const [saveReady, setSaveReady] = useState(false);
    const [songData, setSongData] = useState(null);
    const [modalSaving, setModalSaving] = useState(false);

    const fileInputRef = useRef(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const existingImgRef = useRef(null);

    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    }

    const handleSongEditClick = (e) => {
        handleSubmit(onSubmit);
        
    }

    const fileSelected = (e) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            //Image URL e.target.result
            setImgSrc(e.target.result);
            setShowCropModal(true);
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    useDebounceEffect(
        async () => {
          if (
            completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current &&
            previewCanvasRef.current
          ) {
            // We use canvasPreview as it's much faster than imgPreview.
            canvasPreview(
              imgRef.current,
              previewCanvasRef.current,
              completedCrop
            )
          }
        },
        100,
        [completedCrop],
      )
    
    const handleGenreChange = (e) => {
        
        let genres =  getValues();
        if(genres.genre.length > 3){
            setError('genre', {type: 'maxLength', message: "please select no more than 3 genres"});
        }
        if(genres.genre.length < 4){
            clearErrors('genre', 'maxLength');
        }
    }

    const onSubmit = (data) => {
        if(getValues().genre.length > 3){
            setError('genre', {type: 'maxLength', message: "maximum 3 genres."});
        }else {
            if(completedCrop){
                getPresignedUrl();
            }else {
                setFileKey(songData.songimage);
                setSaveReady(true);
            }
        }
    };

    const getPresignedUrl = () => {
        let imageid = uuid();
        let senddata = {
            id : imageid,
        }
        const imageUrl = fetch("../api/getPresignedImageUrl", {
            method: 'post',
            headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
            }),
            body: JSON.stringify(senddata)
        }).then((res) => res.json())
        .then(async (data) => {
            setPresignedUrl(data.result);
            let fileToUpload = await getImageAsFile(data.filename);
            uploadFile(data.key, fileToUpload, data.result);
        });
    }

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
      }

    const getImageAsFile = async (filename) => {
        const imageFile = await new Promise((resolve, reject) => {
            previewCanvasRef.current.toBlob(file => {
              file.name = filename;
              resolve(file);
            }, 'image/jpeg');
          });
        return imageFile;
    }

    const uploadFile = async(filekey, fileToUpload, presigned) => {

        const result = await new Promise((resolve,reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', presigned, true);
            xhr.onload = (e) => {
                let resultData = {
                    key: filekey
                }
                resolve(resultData);
                if (xhr.status === 200) {
                    console.log('Uploaded data successfully');
                }
            };
            
            xhr.onerror = () => {
                reject('error in file upload');
            };
            xhr.send(fileToUpload);
        });
        
        setFileKey(filekey);
        finishStep();
    }

    const handleChecked = (id) => {
        if(songInfo.genres){
            for (const [key, value] of Object.entries(songInfo.genres)) {
                if(id == value.genre_id){
                    return "checked";
                }
            }
        }
    }

    const finishStep = () => {
        loading(false);
        setSaveReady(true);
    }

    useEffect(() => {
        if(saveReady == true){
            recordSongInfo();
            setSaveReady(false);
        }
    }, [saveReady])

    const cancelCrop = () => {
        setCompletedCrop(null);
        setShowCropModal(false);
    }

    const recordSongInfo = () => {

        //gather all form data first
        
        let senddata = getValues();
        senddata.songimage = fileKey;
        senddata.songid = songInfo.songid;
        console.log("song update info", senddata);
        loading(true);
        setModalSaving(true);
        const update = fetch("../api/updateSongInfo", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(senddata)
        }).then((res) => res.json())
        .then(async (data) => {
            console.log("after api:", data);
            onSave();
            loading(false);
            setModalSaving(false);
            setCompletedCrop(false);
        });
    }

    useEffect(() => {
        reset(songInfo);
        setSongData(songInfo);
    },[songInfo])

    

    return (

        
        <>
        <CropModal
            imgSrc={imgSrc}
            imgRef={imgRef}
            onClose={() => setShowCropModal(false)}
            submitCrop={() => setSubmitCrop(src)}
            onCropComplete={(c) => setCompletedCrop(c)}
            onCancel={() => cancelCrop()}
            show={showCropModal}
        >
        </CropModal>

        { show ? (
    
            <div className="relative z-[99] lg:z-10 song-edit-modal" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <div className="border-area relative bg-white text-left overflow-hidden shadow-xl transform transition-all md:max-w-5xl sm:my-8 sm:max-w-lg sm:w-[50%]">
                        {songData && (
                            <>
                            <h3 className="modal-header flex items-center text-sm italic leading-6 font-medium p-4" id="modal-title"><SiAudiomack className="text-2xl mr-2" />{songData && songData.songname}</h3>
                            <div className="bg-white pb-4 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                                        
                                        <div className="text-center modal-title mb-4">
                                            <h2 className="text-2xl">edit your song details</h2>
                                            <div className="inline-block"><p className="flex items-center"><FaAsterisk className="mr-1 text-red-700 text-[9px]" />enter all required fields</p></div>
                                        </div>

                                        <form className="abreak-form px-6" onSubmit={handleSubmit(onSubmit)}> 
                                            <div className="mb-4 relative mb-4 pb-6 border-b-2 border-dotted border-fuchsia-200">
                                                <label htmlFor="songname" className="py-2 flex">song title<FaAsterisk className="text-red-700 text-[9px]" /></label>
                                                <input
                                                    type="text"
                                                    name="songname"
                                                    defaultValue={songData.songname}
                                                    {...register('songname', {
                                                        required: "song name is required",
                                                        maxLength: {
                                                            value: 75,
                                                            message: "song name cannot be longer than 75 characters"
                                                        }
                                                    })}
                                                    className="w-full"
                                                />
                                                {errors.songname && (<span className="form-error">{errors.songname.message}</span>)}
                                            </div>
                                            
                                            <div className="flex lg:flex-row flex-col items-center mb-4 pb-6 border-b-2 border-dotted border-fuchsia-200">
                                                <div>
                                                    {!completedCrop && songData && songData.songimage && (
                                                        <img 
                                                            ref={existingImgRef}
                                                            width="150px"
                                                            height="150px"
                                                            className="mr-4 border-2 border-black"
                                                            src={process.env.NEXT_PUBLIC_CLOUDFRONT_BASE + songData.songimage} />
                                                            
                                                    )}
                                                    {!!completedCrop && (
                                                        <canvas
                                                            ref={previewCanvasRef}
                                                            style={{
                                                            border: '1px solid black',
                                                            objectFit: 'contain',
                                                            width: 150,
                                                            height: 150,
                                                            }}
                                                            className="mr-4"
                                                        />
                                                    )}
                                                </div>
                                            
                                                <div className="relative text-center lg:text-left lg:mt-0 mt-4">
                                                    <button type="button" className="yellow-button" onClick={handleFileButtonClick}>
                                                        {songData.songimage ? ("replace song image") : ("select an image")}
                                                    </button>
                                                    <input
                                                        type="file"
                                                        name="artistimage"
                                                        onChange={fileSelected}
                                                        ref={fileInputRef}
                                                        hidden
                                                    />
                                                    {errors.artistimage && (<span className="form-error">{errors.artistimage.message}</span>)}
                                                    <p className="max-w-[450px] leading-4 pt-2"><small>image types accepted: .png, .jpg. <br/>song images are not required. If an image isn't chosen, then it will default to your main profile image when displayed on the aBreak58 playlist</small></p>
                                                </div>
                                            </div>

                                            <div className="mb-4 relative pb-2 border-b-2 border-dotted border-fuchsia-200">
                                                <label htmlFor="genre" className="flex">genre<FaAsterisk className="text-red-700 text-[9px]" /></label>
                                                <p className="text-left"><small><em>for this song (max. 3)</em></small></p>
                                                <div className="genre-grid text-left" onChange={handleGenreChange}>
                                                    {genres && genres.map((genre) => (
                                                        <div className="genre-check" key={genre.id}>
                                                            <input 
                                                            type="checkbox" 
                                                            name="genre" 
                                                            {...register('genre', {
                                                                required: "at least one genre must be selected",
                                                                maxLength: {
                                                                    value: 3,
                                                                    message: "too many genres selected"
                                                                },
                                                                onChange:(e) => {handleGenreChange}
                                                            })}
                                                            defaultChecked={handleChecked(genre.id)}
                                                            value={genre.id} />
                                                            <label htmlFor="genre">{genre.genre}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                                {errors.genre && (<span className="form-error">{errors.genre.message}</span>)}
                                            </div>

                                            <div className="mb-6 relative pb-6 border-b-2 border-dotted border-fuchsia-200">
                                                <label htmlFor="lyrics" className="text-center">lyrics</label>
                                                <p className="text-slate-700"><em>max: 2,500 characters</em></p>
                                                <textarea
                                                    name="lyrics"
                                                    className="block w-[100%] h-[200px] mt-2"
                                                    {...register('lyrics', {
                                                        maxlength: {
                                                            value: 2500,
                                                            message: "lyrics cannot be longer than 2,500 characters"
                                                        }
                                                    })}
                                                    defaultValue={songInfo && songInfo.lyrics}
                                                ></textarea>
                                                {errors.lyrics && (<span className="form-error">{errors.lyrics.message}</span>)}
                                            </div>
                                            
                                            <div className="flex lg:flex-row flex-col items-stretch justify-between mb-4">
                                                <div className="relative w-full pr-2 text-left mb-4 lg:mb-0">
                                                    <label htmlFor="spotify_link" className="block">spotify link</label>
                                                    <input 
                                                        type="text" 
                                                        name="spotify_link" 
                                                        defaultValue={songInfo && songInfo.spotify_link}
                                                        {...register('spotify_link')}
                                                        className="w-[100%]"
                                                    />
                                                </div>
                                                <div className="relative w-full text-left">
                                                    <label htmlFor="youtube_link" className="block">youtube link</label>
                                                    <input 
                                                        type="text" 
                                                        name="youtube_link" 
                                                        defaultValue={songInfo && songInfo.youtube_link}
                                                        {...register('youtube_link')}
                                                        className="w-[100%]"
                                                    />
                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                            </>
                        )}
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex flex justify-end">
                            <button type="button" onClick={handleCloseClick} className="text-xl mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-m button flex items-center white-button"><MdCancel className="mr-2 text-xxl"/> close</button>
                            {modalSaving == true ? (
                                <button type="button" className="yellow-button">saving...</button>
                            ):(
                                <button type="button" onClick={handleSubmit(onSubmit)} className="text-xl mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-m yellow-button"><MdDataSaverOn className="mr-2 text-xxl"/> save</button>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null}
        </>
    )
}