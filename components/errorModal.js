import { data } from 'autoprefixer';
import parse from 'html-react-parser';
import Link from 'next/link';
import React, {useEffect, useRef, useState} from "react"
  

export default function ErrorModal({show, onClose, children, title, content}){

    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    }


    return(
        <>
        { show ? (
    
            <div className="fixed z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="error-modal fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <div className="relative bg-amber-400 rounded-lg text-left overflow-hidden shadow-xl transform transition-all md:max-w-5xl sm:my-8 sm:max-w-lg sm:w-full">
                        <h3 className="text-sm italic mb-2 leading-6 font-medium p-4" id="modal-title">error message</h3>
                            <div className="bg-amber-400 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    
                                    <div className="mt-2">
                                        <div className="text-center pb-10">
                                            {content.statuscode == "ABREAK101" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>We could not find your user in our system. Please try again or register.</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK102" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>wrong username or password</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK103" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>please confirm your email address.<br/> If you did not receive an email, click resend and check your email.</p>
                                                <Link href="#" className="btn btn-primary" id="resendConfirmation" data-dismiss="modal">resend confirmation</Link>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK104" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>please upload a file that is 20mb or less</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK105" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>pleae upload an mp3 file.</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK105b" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>image must be a .png or .jpg file.</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK106" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>an email confirmation has been sent to your updated email address. Click the link in the email to finish updating your email address</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK107" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>a password confirmation has been sent to your email. Click the link in the email to finish resetting your password</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK108" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>a user with that email address was not found in our system</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK109" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>your password has been reset. You may now <Link href="/login">log in</Link> with the new password.</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK110" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>please use a different email, or recover your password if you have lost it.</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK111" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>please try again, or give it a few minutes if you have tried to log in many times in the past few minutes.</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK112" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>user does not have permission to perform this action. Please log in again with the correct permissions.</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK113" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>username can only contain numbers, letters, underscores and special characters.</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK114" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>if your email has been found in our system, your username has been sent to your email.</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK115" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>please choose a different username.</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK116" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>make sure you are using a valid email format.</p>
                                                </>
                                            ) : ""}
                                            {content.statuscode == "ABREAK117" ? (
                                                <>
                                                <h2 className="text-[2em]"><strong>{parse(content.message)}</strong></h2>
                                                <p>contact support to resolve this issue.</p>
                                                </>
                                            ) : ""}

                                            
                                            
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