import React, {useRef, useState} from "react"
import { useForm } from "react-hook-form"
import {FaUser} from "react-icons/fa"
import Reaptcha from "reaptcha"
  

export default function ForgotUsernameModal({show, onClose, usernameSubmit, success}){

    const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();
    const [captchaSiteKey, setCaptchaSiteKey] = useState("6Lenq0obAAAAAEXDR6MmyoFO3vMYyAFpvKpLWqLL");
    const [captchaResponse, setCaptchaResponse] = useState(null);

    const captchaRef = useRef();
    const emailRef = useRef();
    const onSubmit = (data) => {
        data['g-recaptcha-response'] = captchaResponse;
        usernameSubmit(data);
    }
    const captchaLoad = () => {
        if(captchaRef.current.state.rendered == false){
            captchaRef.current.renderExplicitly();
        }
    }
    const captchaVerify = (response) => {
        setCaptchaResponse(response);
    }
    

    return(
        <>
        { show ? (
    
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all md:max-w-5xl sm:my-8 sm:max-w-lg sm:w-[50%]">
                        <h3 className="modal-header text-sm italic mb-2 leading-6 font-medium p-4 flex items-center" id="modal-title"><FaUser className="mr-2" /> forgot username</h3>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    
                                    <div className="mt-2 text-center">
                                        {!success && (
                                            <>
                                        <h2 className="text-2xl">enter your email</h2>
                                        <form className="abreak-form mt-2 px-12" onSubmit={handleSubmit(onSubmit)} >
                                            <div className="mb-4">
                                                <input 
                                                    ref={emailRef} 
                                                    type="email" 
                                                    {...register("email", {
                                                        required: "email is required",
                                                        pattern: {
                                                            value:
                                                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                            message: "Invalid email address",
                                                        }, 
                                                    })}
                                                    className="w-full"
                                                />
                                                {errors.email && (<span className="form-error">{errors.email.message}</span>)}
                                            </div>
                                            <div className="text-center">
                                                <Reaptcha
                                                    ref={captchaRef} 
                                                    className="m-auto"
                                                    size="normal" 
                                                    id="registerCaptcha"
                                                    sitekey={captchaSiteKey} 
                                                    onLoad={captchaLoad}
                                                    onVerify={captchaVerify}
                                                    explicit
                                                    />
                                            </div>
                                        </form>
                                            </>
                                        )}

                                        {success && (
                                            <h2 className="text-2xl">check your email to retrieve your username</h2>
                                        )}
                                    </div>
                                    
                                </div>
                            </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex flex justify-end">
                                
                                {success == false ? (
                                    <>
                                        <button type="button" onClick={()=> onClose()} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">cancel</button>
                                        <button type="button" onClick={handleSubmit(onSubmit)} className="mt-3 w-full inline-flex justify-center rounded-md border yellow-btn shadow-sm px-4 py-2 bg-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">submit</button>
                                    </>
                                ): (
                                    <button type="button" onClick={()=> onClose()} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">close</button>
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