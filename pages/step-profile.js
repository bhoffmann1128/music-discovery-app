import Head from "next/head";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styles from '../styles/StepForm.module.css'
import FullWidthLayout from '../components/fullWIdthLayout'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import CropModal from "../components/cropModal";
import { useDebounceEffect } from '../helpers/useDebounceEffect'
import { canvasPreview } from '../helpers/canvasPreview'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'


import 'react-image-crop/dist/ReactCrop.css'
import uuid from "react-uuid";


export default function Page({props}){
    const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();
    const [formStep, setFormStep] = useState(1);
    const [imgSrc, setImgSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [showCropModal, setShowCropModal] = useState(false);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [loadingMsg, setLoadingMsg] = useState(false);
    const [presignedUrl, setPresignedUrl] = useState(null)
    
    const previewCanvasRef = useRef();
    const imgRef = useRef(null)
    const formStep1 = useRef("formStep1");
    const formStep2 = useRef("formStep2");
    const formStep3 = useRef("formStep3");
    const formStep4 = useRef("formStep4");
    const formStep5 = useRef("formStep5");

    const handleStepSubmit = (e, formStep) => {
        e.preventDefault();
        if(formStep == 2){
            step1Submit();
        }
        //setFormStep(formStep);
    }

    const step1Submit = (e) => {
        let imageid = uuid();
		//let user = Cookies.get('abreak_username');
		//let filename = user + "-" + imageid + '.' + "png";
		//let key = 'artists/' + user + '/images/' + filename;
        let base64Image = previewCanvasRef.current.toDataURL("image/jpeg", 1);
        let senddata = {
            id : imageid,
        }
        const login = fetch("../api/getPresignedUrl", {
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
            console.log("getImageAsFile");
            uploadFile(data.key, data.filename, fileToUpload);
        });
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

    const uploadFile = async(filekey, filename, fileToUpload) => {

        const result = await new Promise((resolve,reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', presignedUrl, true);
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
        console.log("uploaded file result", result);
    }

    const setSubmitCrop = (croppedImage) => {
        console.log("crop submitted");
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
            console.log("using debounce", imgRef);
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
            <div className="w-full px-10 py-20">

                <CropModal
                    imgSrc={imgSrc}
                    imgRef={imgRef}
                    onClose={() => setShowCropModal(false)}
                    submitCrop={() => setSubmitCrop(src)}
                    onCropComplete={(c) => setCompletedCrop(c)}
                    show={showCropModal}
                >
                </CropModal>

                {formStep == 1 ? (
                    <form className="abreak-form" ref={formStep1}> 
                        <div>
                            {!!completedCrop && (
                            <canvas
                                ref={previewCanvasRef}
                                style={{
                                border: '1px solid black',
                                objectFit: 'contain',
                                //width: completedCrop.width,
                                //height: completedCrop.height,
                                width: 300,
                                height: 300,
                                }}
                            />
                            )}
                        </div>
                        <div className="mb-4 relative">
                            <input
                                type="file"
                                onChange={fileSelected}
                            />
                            <input 
                                className="w-full" 
                                placeholder="artist name" 
                                defaultValue="" {...register("artistname", {
                                    required: "artist name is required",
                                    maxLength: {
                                        value: 50,
                                        message: "artist name cannot be longer than 50 characters"
                                    }
                            })} />
                            {errors.artistname && (<span className="form-error">{errors.artistname.message}</span>)}
                        </div>
                        <div className="w-full">
                            <button className="btn-primary float-right" onClick={(e)=>handleStepSubmit(e,2)}>next&nbsp;<FaChevronRight /></button>
                        </div>
                    </form>
                ) : null}
                {formStep == 2 ? (
                    <form className="abreak-form" ref={formStep2}> 
                        <h2>FORM STEP 2</h2>
                        <div className="flex items-center justify-between">
                            <button className="btn-primary" onClick={(e)=>handleStepSubmit(e,1)}><FaChevronLeft />&nbsp;prev</button>
                            <button className="btn-primary" onClick={(e)=>handleStepSubmit(e,3)}>next&nbsp;<FaChevronRight /></button>
                        </div>
                    </form>
                ) : null}
                {formStep == 3 ? (
                    <form className="abreak-form" ref={formStep2}> 
                        <h2>FORM STEP 3</h2>
                        <div className="flex items-center justify-between">
                            <button className="btn-primary" onClick={(e)=>handleStepSubmit(e,2)}><FaChevronLeft />&nbsp;prev</button>
                            <button className="btn-primary" onClick={(e)=>handleStepSubmit(e,4)}>next&nbsp;<FaChevronRight /></button>
                        </div>
                    </form>
                ) : null}
            </div>
        </div>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <FullWidthLayout>
        {page}
      </FullWidthLayout>
    )
  }