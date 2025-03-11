import parse from 'html-react-parser';
import React, {useEffect, useRef, useState} from "react"
  

export default function UploadProgressModal({show, onClose, progress}){

    
    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    }

    return(
        <>
        { show ? (
    
            <div className="relative z-10 upload-modal" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <div className="border-area relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 ">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 w-full text-center">
                                    
                                    <div className="mt-2 text-center">
                                        <img src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2022/12/abreak-upload-load.gif`} className="m-auto" />
                                        <span className="block progress-block"><span>%</span>{progress}</span>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null}
        </>
    )
}