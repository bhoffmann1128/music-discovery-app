import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import {useRouter} from 'next/router';
import { useForm } from "react-hook-form";
import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import {FaCheckCircle} from 'react-icons/fa';
import {AiFillCloseCircle} from 'react-icons/ai';
import { IconContext } from 'react-icons';
import TermsModal from '../components/termsModal';
import Reaptcha from 'reaptcha';
import ErrorModal from '../components/errorModal';
import { calculateSizeAdjustValues } from 'next/dist/server/font-utils';

export async function getStaticProps() {
    // Fetch data from external API
    //const res = await fetch(`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/wp/v2/pages/3`);
    const res= await fetch(`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-json/wp/v2/pages/?slug=terms-conditions&&acf_format=standard`);
    const data = await res.json();
    // Pass data to the page via props

    return {
        props: {
           pageHeader: {
              title: "aBreak music - registration",
              metas: [
                 {
                    name: 'description',
                    content: "aBreak Music is a free new music and artist discovery platform based in the US – and we’re very different from what you’re used to. the people running and associated with aBreak are some of the most experienced and connected executives in music.",
                 },
                 { property: 'og:title', content: "aBreak music - register" },
                 {
                    property: 'og:image',
                    content: `${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}wp-content/uploads/2022/03/abreak-loog-white-text-transp-e1647870753903.png`,
                 },
                 {
                    property: 'og:description',
                    content: "aBreak Music is a free new music and artist discovery platform based in the US – and we’re very different from what you’re used to. the people running and associated with aBreak are some of the most experienced and connected executives in music.",
                 },
              ],
           },
           terms: data,
 
        },
        revalidate: 5 * 60, // re-generate each 5 minutes
     };

    //return { props: { data } }
  }

export default function Page(props) {
    
    const { register, handleSubmit, watch, getValues,setValue, formState: { errors } } = useForm();
    const [duplicateUsername, setDuplicateUsername] = useState(null);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorContent, setErrorContent] = useState(null);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [accountType, setAccountType] = useState("free");
    const [captchaSiteKey, setCaptchaSiteKey] = useState("6Lenq0obAAAAAEXDR6MmyoFO3vMYyAFpvKpLWqLL");
    const [captchaResponse, setCaptchaResponse] = useState(null);
    const [loadingMsg, setLoadingMsg] = useState(false);

    const captchaRef = useRef("captchaEl");
    const usernameRef = useRef(null);
    const router = useRouter();

    //captchaRef.current.props.grecaptcha.reset();
    const onError = (errors,e) => {
        
    };
    const onSubmit = (data, e) => {
        
        setLoadingMsg(true);
        data.service = accountType;
        data['g-recaptcha-response'] = captchaResponse;
        
        const playlistRes = fetch("../api/register", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(data)
        }).then((res) => res.json())
        .then((result) => {
            if(result.result.status == "ERROR"){
                setErrorContent(result.result);
                setShowErrorModal(true);
                setLoadingMsg(false);
            }else {
                finishRegistration(result);
            }
        });
    }

    const finishRegistration = (data) =>{
        let senddata = {};
        senddata.username = getValues('username');
        senddata.userid = data.result.userid;
        senddata.type = "registration";
    
        const sendmail = fetch("../api/sendMail", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(senddata)
        }).then((res) => res.json())
        .then((data) => {
            router.push("register-complete");
            setLoadingMsg(false);
        });
    }
    
    //const termsContent = props.terms.content.rendered;
    const termsContent = props.terms[0].content.rendered;
    
    const handleUsernameChange = (e) => {
        const playlistRes = fetch("../api/checkUsernameDuplicate", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify({username:e.target.value})
        }).then((res) => res.json())
        .then((data) => {
            setDuplicateUsername(data.check);
        });
    }

    const handleTermsClick = (e) => {
        setShowTermsModal(true);
    }

    useEffect(() => {
        if(acceptTerms == true){
            setValue("agreetoterms", true);
        }
    }, [acceptTerms]);


    const captchaLoad = () => {
        if(captchaRef.current.state.rendered == false){
            captchaRef.current.renderExplicitly();
        }
    }
    const captchaVerify = (response) => {
        setCaptchaResponse(response);
    }
    

    //console.log(watch('example'));
    return (
        <>
        <div className={styles.container}>
            <Head>
                <title>{props.pageHeader.title}</title>
                { props.pageHeader.metas.map((attributes, index) => (
                <meta {...attributes} key={index} />
                )) }
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {loadingMsg==true &&
                <div className="fixed z-[9999] top-0 left-0 text-center flex justify-center items-center w-full h-full bg-white/75">
                    <img src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2022/01/abreak-loading-animation-white.svg`} width="100" height="auto"/>
                </div>
            }
            <div className="center-content">
                <h2 className="page-title">start getting noticed today.</h2>
                <form className="abreak-form" onSubmit={handleSubmit(onSubmit,onError)}>
                    <div className="mb-4 relative">
                        <input 
                            className="w-full" 
                            placeholder="username" 
                            ref={usernameRef}
                            defaultValue="" {...register("username", {
                                onBlur: (e) => handleUsernameChange(e),
                                required: "username is required",
                                minLength: {
                                    value: 5,
                                    message: "username must be at least 5 characters and no spaces"
                                },
                                pattern: {
                                    value:/^[a-zA-Z0-9()._-]+$/,
                                    message: "username can only container letters, hyphens, underscores and numbers with no spaces"
                                }
                        })} />
                        <IconContext.Provider value={{color: 'red', size: '25px'}}>
                            {duplicateUsername == false ?  <div className="username-duplicate absolute right-[10px] top-[15px]"><AiFillCloseCircle /></div> : null }
                        </IconContext.Provider> 
                        <IconContext.Provider value={{color: 'green', size: '25px'}}>
                            {duplicateUsername == true ?  <div className="username-duplicate absolute right-[10px] top-[15px]"><FaCheckCircle /></div> : null }
                        </IconContext.Provider>
                        {errors.username && (<span className="form-error">{errors.username.message}</span>)}
                    </div>
                    <div className="mb-4">
                        <input 
                            className="w-full" 
                            placeholder="email" 
                            type="email" {...register("email", { 
                                required: "email is required",
                                pattern: {
                                    value:
                                      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: "Invalid email address",
                                  }, 
                            })} />
                        {errors.email && (<span className="form-error">{errors.email.message}</span>)}
                    </div>
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
                    <div className="mb-4 flex items-center">
                        <input 
                            type="checkbox"
                            onClick={handleTermsClick}
                            {...register("agreetoterms", {
                                required:true
                            })}
                            checked={acceptTerms}
                        />
                        <p className="pl-2">I agree to the terms of service</p>
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
                    </div>
                    
                    <ErrorModal
                        onClose={() => setShowErrorModal(false)}
                        show={showErrorModal}
                        content={errorContent}
                    ></ErrorModal>

                    <button type="submit" className="yellow-button"  >submit</button>
                </form>
            </div>

        </div>
        <TermsModal
        onClose={() => setShowTermsModal(false)}
        acceptTerms={() => setAcceptTerms(true)}
        show={showTermsModal}
        content={termsContent}
        ></TermsModal>
        </>
    )
}
