import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styles from '../../styles/StepForm.module.css'
import FullWidthLayout from '../../components/fullWIdthLayout'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import CropModal from "../../components/cropModal";
import { useDebounceEffect } from '../../helpers/useDebounceEffect'
import { canvasPreview } from '../../helpers/canvasPreview'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import 'react-image-crop/dist/ReactCrop.css'
import uuid from "react-uuid";
import { useRouter } from "next/router";
import { isPropertySignature } from "typescript";


export default function Step1({profileData, stepSubmit}){

    const { register, handleSubmit, watch, getValues, setError, clearErrors, formState: { errors } } = useForm();
    const [imgSrc, setImgSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [showCropModal, setShowCropModal] = useState(false);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [loadingMsg, setLoadingMsg] = useState(false);
    const [presignedUrl, setPresignedUrl] = useState(null);
    const [fileKey, setFileKey] = useState();
    const [artistName, setArtistName] = useState(null);
    const [stepReady, setStepReady] = useState(false);
    const [hasProfileImage, setHasProfileImage] = useState(false);
    
    const previewCanvasRef = useRef();
    const fileInputRef = useRef();
    const imgRef = useRef(null);
    const existingImgRef = useRef(null);
    const router = useRouter();

    const onSubmit = (data) => {
        
        if(hasProfileImage == false){
            setError('artistimage', {type: 'required', message: "profile image is required"});
        }else {
            setArtistName(data.artistname);
            step1Submit();
        }
    };

    useEffect(()=> {
        if(profileData.artistimage) {
            setHasProfileImage(true);
            clearErrors('artistimage', 'required');
        }
        if(completedCrop){
            setHasProfileImage(true);
            clearErrors('artistimage', 'required');
        }
    }, [profileData.artistimage, completedCrop])

    const step1Submit = (e) => {

         if(existingImgRef.current == null){
            setLoadingMsg(true);
            let imageid = uuid();
            let senddata = {
                id : imageid,
            }
            const login = fetch("../api/getPresignedImageUrl", {
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
                uploadFile(data.key, data.filename, fileToUpload, data.result);
            });
        }else {
            setFileKey(profileData.artistimage);
            finishStep();
         }
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

    const uploadFile = async(filekey, filename, fileToUpload, presigned) => {

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

    const fileSelected = (e) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            //Image URL e.target.result
            setImgSrc(e.target.result);
            setShowCropModal(true);
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    const finishStep = () => {
        setLoadingMsg(false);
        setStepReady(true);
    }

    useEffect(() => {
        if(stepReady == true){
            let data = {};
            data.artistname = artistName;
            data.artistimage = fileKey;
            stepSubmit(data);
        }
    }, [stepReady])

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
      
      const handleFileButtonClick = () => {
        fileInputRef.current.click();
      }

      const cancelCrop = () => {
        setCompletedCrop(null);
        setShowCropModal(false);
      }

    return (
        <div className={styles.container}>
            <Head>
                <title>complete your profile</title>
                <meta name="description" content="aBreak58 profile" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {loadingMsg==true &&
                <div className="fixed z-[9999] top-0 left-0 text-center flex justify-center items-center w-screen h-screen bg-white/75">
                    <img src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2022/01/abreak-loading-animation-white.svg`} width="100" height="auto"/>
                </div>
            }
            <div className="w-full lg:px-10 pt-4 pb-10">

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

                
                <form className="abreak-form lg:px-[10vw]" onSubmit={handleSubmit(onSubmit)}> 
                    
                    <h2 className="text-xl text-center mb-4 py-2 rounded formstep-title lg:px-10 mx-auto">image & artist name</h2>
                    
                    <div className="flex items-center lg:flex-row flex-col mb-4">
                        <div>
                            {/*!completedCrop && (
                                <div className="w-[300px] h-[300px] border-solid border-2 border-slate-500 bg-slate-300"></div>
                            )*/}
                            {!completedCrop && profileData.artistimage && (
                                <img 
                                    ref={existingImgRef}
                                    width="300px"
                                    height="400px"
                                    className="mr-4 border-2 border-black"
                                    src={process.env.NEXT_PUBLIC_CLOUDFRONT_BASE + profileData.artistimage} />
                            )}
                            {!!completedCrop && (
                                <canvas
                                    ref={previewCanvasRef}
                                    style={{
                                    border: '1px solid black',
                                    objectFit: 'contain',
                                    width: 300,
                                    height: 300,
                                    }}
                                    className="mr-4"
                                />
                            )}
                        </div>
                        <div className="mb-4 mt-4 lg:mt-0 relative">
                            <button type="button" className="yellow-button w-full items-center justify-center" onClick={handleFileButtonClick}>select an image</button>
                            <input
                                type="file"
                                name="artistimage"
                                onChange={fileSelected}
                                ref={fileInputRef}
                                hidden
                                
                            />
                            {errors.artistimage && (<span className="form-error">{errors.artistimage.message}</span>)}
                            <p><small>required: image types accepted: .png, .jpg. </small></p>
                        </div>
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="artistname" className="py-2 block">artist name</label>
                        <input 
                            className="w-full" 
                            placeholder="artist name" 
                            {...register("artistname", {
                                required: "artist name is required",
                                maxLength: {
                                    value: 50,
                                    message: "artist name cannot be longer than 50 characters"
                                }
                        })} 
                            defaultValue={profileData.artistname}
                        />
                        {errors.artistname && (<span className="form-error">{errors.artistname.message}</span>)}
                    </div>
                    <div className="w-full">
                        <button className="btn-primary float-right" type="submit">next&nbsp;<FaChevronRight /></button>
                    </div>
                </form>
                
            </div>
        </div>
    )
}