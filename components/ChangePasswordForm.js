import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import Reaptcha from "reaptcha"
import ErrorModal from "./errorModal"

export default function ChangePasswordForm({props}){

    const { register, handleSubmit, watch, getValues, setError, clearErrors, formState: { errors } } = useForm();
    const [loadingMsg, setLoadingMsg] = useState(false);
    const [captchaResponse, setCaptchaResponse] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorContent, setErrorContent] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [resetToken, setResetToken]= useState(null);
    
    const captchaRef = useRef();
    const [captchaSiteKey, setCaptchaSiteKey] = useState("6Lenq0obAAAAAEXDR6MmyoFO3vMYyAFpvKpLWqLL");

    const router = useRouter();
    //const resetToken = new URLSearchParams(window.location.search).get('c');
    
    const captchaLoad = () => {
        if(captchaRef.current.state.rendered == false){
            captchaRef.current.renderExplicitly();
        }
    }
    const captchaVerify = (response) => {
        setCaptchaResponse(response);
        clearErrors('captcha', 'required');
    }

    const onSubmit = (data) => {
        
        if(!captchaResponse){
            setError('captcha', {type: 'required', message: "captcha is required"});
            return;
        }
        setLoadingMsg(true);
        data['g-recaptcha-response'] = captchaResponse;
        data.token = resetToken;
        
        const playlistRes = fetch("../api/changeUserPassword", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(data)
        }).then((res) => res.json())
        .then((data) => {
            setLoadingMsg(false);
            router.push("/login?password-reset=true");
        });
    }

    useEffect(()=> {
        let t = new URLSearchParams(window.location.search).get('c');
        if(t){
            setResetToken(t);
        }
    
    },[])
    
    return (
        <>
        {loadingMsg==true &&
                <div className="fixed z-[9999] top-0 left-0 text-center flex justify-center items-center w-full h-full bg-white/75">
                    <img src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2022/01/abreak-loading-animation-white.svg`} width="100" height="auto"/>
                </div>
            }
          <div>
            <div className="w-full max-w-s">
                <h1 className="text-2xl text-center">reset password</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="abreak-form bg-white shadow-md rounded px-[10vw] pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <input 
                        className="w-full" 
                        placeholder="password" 
                        type="password" 
                        {...register("password", { 
                            required: "field is required",
                            minLength: {
                                value: 8,
                                message: "password must be at least 8 characters long"
                            }
                        })} 
                    /> 
                    {errors.password && (<span className="form-error">{errors.password.message}</span>)}
                    <p className="font-xs"><em>password must be at least 8 characters long, contain 1 uppercase letter, 1 number and 1 special character</em></p>
                </div>
                <div className="mb-4">
                    <input 
                        className="w-full" 
                        placeholder="confirm password" 
                        type="password" 
                        {...register("passwordconfirmation", { 
                            required: "field is required",
                            validate: (val) => {
                                if (watch('password') != val) {
                                    return "Your passwords do no match";
                                }
                                },
                        })} 
                    />
                    {errors.passwordconfirmation && (<span className="form-error">{errors.passwordconfirmation.message}</span>)}
                </div>
                <div className = "mb-4">
                  <Reaptcha
                            ref={captchaRef} 
                            size="normal" 
                            id="registerCaptcha"
                            sitekey={captchaSiteKey} 
                            onLoad={captchaLoad}
                            onVerify={captchaVerify}
                            explicit
                            />
                            {errors.captcha && (<span className="form-error">{errors.captcha.message}</span>)}
                </div>
                <div className="flex items-center justify-between">
                    <button className="yellow-button w-full text-center items-center flex justify-center block" type="submit">submit</button>
                </div>
                  <div className="md-4 flex items-center justify-center">{errorMsg}</div>
                </form>
            </div>
          </div>
          <ErrorModal
                onClose={() => setShowErrorModal(false)}
                show={showErrorModal}
                content={errorContent}
            ></ErrorModal>
            
        </>
      );
}