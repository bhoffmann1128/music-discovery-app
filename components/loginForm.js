import { Router, useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import Reaptcha from "reaptcha"
import ErrorModal from "./errorModal"
import { useCookies } from 'react-cookie'
import ForgotPasswordModal from "./ForgotPasswordModal"
import ForgotUsernameModal from "./ForgotUsernameModal"

export default function LoginForm({props}){

    const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();
    const [cookies, setCookie, removeCookie] = useCookies(['abreak-isloggedin']);
    const [errorMsg, setErrorMsg] = useState("");
    const [loadingMsg, setLoadingMsg] = useState(false);
    const [captchaResponse, setCaptchaResponse] = useState(null);
    const [loginReady, setLoginReady] = useState(false);

    const captchaRef = useRef();
    //const [captchaSiteKey, setCaptchaSiteKey] = useState("6Lenq0obAAAAAEXDR6MmyoFO3vMYyAFpvKpLWqLL");
    const [captchaSiteKey, setCaptchaSiteKey] = useState(process.env.NEXT_PUBLIC_RECAPTCHA_KEY);

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorContent, setErrorContent] = useState(null);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
    const [showForgotUsernameModal, setShowForgotUsernameModal] = useState(false);
    const [usernameSubmitSuccess, setUsernameSubmitSuccess] = useState(false);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);


    const router = useRouter();

    const captchaLoad = () => {
        if(captchaRef.current.state.rendered == false){
            captchaRef.current.renderExplicitly();
        }
    }
    const captchaVerify = (response) => {
        setCaptchaResponse(response);
    }

    const onSubmit = async(data) => {
        
        setUsername(data.username);
        setPassword(data.password);
        setLoginReady(true);
        captchaRef.current.execute();

      }

    const submitLogin = async(user, pass, captchaCode) => {
        setLoadingMsg(true);
        //data['g-recaptcha-response'] = captchaCode;

        let data = {
            username: user,
            password: pass,
            'g-recaptcha-response': captchaCode
        }

        const login = fetch("../api/login", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(data)
        }).then((res) => res.json())
        .then((data) => {
            if(data.result.status == "ERROR"){
                setErrorContent(data.result);
                setShowErrorModal(true);
                setLoadingMsg(false);
                setCookie('abreakmusic_isloggedin', false, { path: '/' });
            }else {
                setCookie('abreakmusic_isloggedin', true, { path: '/' });
                if(data.result.hasEmptyProfile == true){
                    router.push("/profile/stepForm");
                }else {
                    router.push("/dashboard");
                }
            }
            
        });
    }

    const handleForgotPassword = () => {
        setShowForgotPasswordModal(true);
    }

    const handleForgotUsername = () => {
        setShowForgotUsernameModal(true);
    }

    const handleForgotPasswordSubmit = (formData) => {
        setLoadingMsg(true);
        const sendReset = fetch("../api/resetPassword", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(formData)
        }).then((res) => res.json())
        .then((data) => {
            setLoadingMsg(false);
            sendPasswordResetNotification(data.result, formData.email);
        });
    }

    const sendPasswordResetNotification = (token, email) => {
        setLoadingMsg(true);
        let data = {
            type: "passwordReset",
            token: token,
            username: email,
            role: "artist"
        }
        const sendMail = fetch("../api/sendPasswordResetNotification", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(data)
        }).then((res) => res.json())
        .then((data) => {
            setLoadingMsg(false);
            setPasswordResetSuccess(true);
        });
    }

    const handleForgotUsernameSubmit = (formData) => {
        
        setLoadingMsg(true);
        const sendReset = fetch("../api/sendUsername", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(formData)
        }).then((res) => res.json())
        .then((data) => {
            setUsernameSubmitSuccess(true);
            setLoadingMsg(false);
        });
    }

    useEffect(() => {

        if(loginReady){
          submitLogin(username, password, captchaResponse);
          setLoginReady(false);
        }
        
      }, [captchaResponse])
    
    return (
        <>
        {loadingMsg==true &&
                <div className="fixed z-[9999] top-0 left-0 text-center flex justify-center items-center w-full h-full bg-white/75">
                    <img src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2022/01/abreak-loading-animation-white.svg`} width="100" height="auto"/>
                </div>
            }
          <div>
            <div className="w-full max-w-s">
                <form onSubmit={handleSubmit(onSubmit)} className="abreak-form bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="username" 
                        type="text" 
                        placeholder="Username" 
                        defaultValue="" {...register("username", {
                            required: "username is required",
                        })}
                    />
                    {errors.username && (<span className="form-error">{errors.username.message}</span>)}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                    </label>
                    <input 
                        className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="password" 
                        type="password" 
                        placeholder="******************" 
                        {...register("password", { 
                            required: "password is required",
                        })}
                    />
                    {errors.password && (<span className="form-error">{errors.password.message}</span>)}
                </div>
                <div className = "mb-4">
                  <Reaptcha
                            ref={captchaRef} 
                            size="invisible" 
                            id="registerCaptcha"
                            sitekey={captchaSiteKey} 
                            onLoad={captchaLoad}
                            onVerify={captchaVerify}
                            explicit
                            />
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Sign In
                    </button>
                    <div className="flex flex-col items-end">
                        <button onClick={handleForgotPassword} type="button" className="mb-1 font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        forgot password
                        </button>
                        <button onClick={handleForgotUsername} type="button" className="font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        forgot username
                        </button>
                    </div>
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
            <ForgotPasswordModal
                onClose={()=>setShowForgotPasswordModal(false)}
                show={showForgotPasswordModal}
                resetSubmit={handleForgotPasswordSubmit}
                success={passwordResetSuccess}
            ></ForgotPasswordModal>
            <ForgotUsernameModal
                onClose={()=>setShowForgotUsernameModal(false)}
                show={showForgotUsernameModal}
                usernameSubmit={handleForgotUsernameSubmit}
                success={usernameSubmitSuccess}
            ></ForgotUsernameModal>
        </>
      );
}