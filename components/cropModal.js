import { useRef, useState } from 'react';
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
  } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'


function centerAspectCrop(
    mediaWidth,
    mediaHeight,
    aspect,
  ) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    )
  }

export default function CropModal({show, onClose, onCancel, onCropComplete, submitCrop, imgSrc, imgRef}){

    const [crop, setCrop] = useState();
    const [aspect, setAspect] = useState(1);
    
    const handleCloseClick = (e) => {
        e.preventDefault();
        onCancel();
    }

    const handleCropClick = (e) => {
        e.preventDefault();
        onClose();
    }

    const onImageLoad = (e) => {
        if (aspect) {
            const { width, height } = e.currentTarget;
            console.log(width, height);
            setCrop(centerAspectCrop(width, height, aspect))
          }
        //setCrop(centerAspectCrop(200, 200, aspect))
    }

    return (

        <>
        { show ? (
    
            <div className="fixed z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed top-0 z-10 inset-0 overflow-y-auto">
                    <div className="flex items-start sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all md:max-w-5xl sm:my-8 sm:max-w-lg sm:w-[50%]">
                        <h3 className="modal-header text-sm italic mb-2 leading-6 font-medium p-4" id="modal-title">crop image</h3>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    
                                    <div className="mt-2 text-center">
                                        {imgSrc ? (
                                            <ReactCrop 
                                                className="text-center"
                                                crop={crop} 
                                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                                onComplete={(c) => onCropComplete(c)}
                                                aspect={aspect}
                                            >
                                                <img 
                                                    className="h-auto w-auto m-auto"
                                                    src={imgSrc} 
                                                    ref={imgRef}
                                                    onLoad={onImageLoad}
                                                />
                                            </ReactCrop>
                                        ):null}
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex flex justify-end">
                            <button type="button" onClick={handleCloseClick} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">cancel</button>
                            <button type="button" onClick={handleCropClick} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-yellow-300 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">crop</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null}
        </>
    )
}