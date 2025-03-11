import { data } from 'autoprefixer';
import parse from 'html-react-parser';
import Link from 'next/link';
import React, {useEffect, useRef, useState} from "react"
import {GrClose} from "react-icons/gr"
  

export default function ArtistVideoModal({show, onClose, children, title, content}){

    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    }


    return(
        <>
        { show ? (
    
            <div className="fixed z-[9999999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed z-40 inset-0 overflow-y-auto">
                    <div className="ml-[35px] mt-[70px] flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all md:max-w-5xl sm:my-8 sm:max-w-lg sm:w-full">
                        <div className="flex justify-between px-6 align-center">
                            <h3 className="text-sm italic mb-2 leading-6 font-medium p-4" id="modal-title">{title}</h3>
                            <button type="button" onClick={handleCloseClick} className=""><GrClose /></button>
                        
                        </div>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    
                                    <div className="mt-2">
                                        <div className="text-center pb-10">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${content.video_code}`}
                                            width="100%"
                                            height="480"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={`${content.artist_name} video`}
                                        ></iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex flex justify-end">
                                <button type="button" onClick={handleCloseClick} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null}
        </>
    )
}