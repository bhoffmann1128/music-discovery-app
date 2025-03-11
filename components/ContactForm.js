import React, {useRef, useState} from "react"
import { useForm } from "react-hook-form"
import {FaEnvelope} from "react-icons/fa"
import Reaptcha from "reaptcha"
  

export default function ContactForm({contactSubmit}){

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [captchaSiteKey, setCaptchaSiteKey] = useState("6Lenq0obAAAAAEXDR6MmyoFO3vMYyAFpvKpLWqLL");
    const [captchaResponse, setCaptchaResponse] = useState(null);

    const captchaRef = useRef();
    const emailRef = useRef();
    const onSubmit = (data) => {
        data['g-recaptcha-response'] = captchaResponse;
        contactSubmit(data);
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
            <form className="abreak-form mt-2 px-2 lg:px-20 w-full" onSubmit={handleSubmit(onSubmit)} >
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
                        placeholder="email"
                    />
                    {errors.email && (<span className="form-error">{errors.email.message}</span>)}
                </div>
                <div className="mb-4">
                    <input 
                        type="text" 
                        {...register("subject", {
                            required: "subject is required",
                        })}
                        className="w-full"
                        placeholder="subject"
                    />
                    {errors.subject && (<span className="form-error">{errors.subject.message}</span>)}
                </div>
                <div className="mb-4">
                    <textarea
                        name="message"
                        className="block w-[100%] h-[200px] mt-6"
                        {...register('message', {
                            minLength: {
                                value: 50,
                                message: "message must be at least 50 characters"
                            },
                            maxlength: {
                                value: 4500,
                                message: "please keep your email under 4500 characters"
                            }
                        })}
                        placeholder="message"
                    ></textarea>
                    {errors.message && (<span className="form-error">{errors.message.message}</span>)}
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
                <button onClick={handleSubmit(onSubmit)} className="yellow-button mt-4">submit</button>
            </form>

            
        </>           
        
    )
}