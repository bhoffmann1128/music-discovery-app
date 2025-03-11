import parse from 'html-react-parser';
import React, {useEffect, useRef, useState} from "react"
  

export default function TermsModal({show, onClose, acceptTerms, children, title, content}){

    const [showAcceptBtn, setShowAcceptBtn] = useState(false);
    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    }

    const handleAcceptTermsClick = (e) => {
        e.preventDefault();
        acceptTerms(true);
        onClose();
    }

    const handleScroll = (e) => {
        let scrollTotal = e.currentTarget.clientHeight + e.currentTarget.scrollTop+250;
        if(scrollTotal >= e.currentTarget.scrollHeight){
            setShowAcceptBtn(true);
        }
        /*if(e.currentTarget.scrollTop > 2600){
            
        }*/
    }

    return(
        <>
        { show ? (
    
            <div className="fixed z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all md:max-w-5xl sm:my-8 sm:max-w-lg sm:w-[50%]">
                        <h3 className="modal-header text-sm italic mb-2 leading-6 font-medium p-4" id="modal-title">terms & conditions</h3>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    
                                    <div className="mt-2">
                                        <h2 className="py-4 text-xl">scroll to read and accept the terms</h2>
                                        <div 
                                            className="termsScroll"
                                            onScroll={handleScroll}
                                        >
                                            {parse(content)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex flex justify-end">
                            <button type="button" onClick={handleCloseClick} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">close</button>
                            { showAcceptBtn && (
                            <button 
                                type="button" 
                                onClick={handleAcceptTermsClick} 
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-black-700 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    accept terms
                                </button>
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