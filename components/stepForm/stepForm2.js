import Head from "next/head";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styles from '../../styles/StepForm.module.css'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import 'react-image-crop/dist/ReactCrop.css'

export default function Step2({profileData, stepSubmit, prevClick}){

    const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();
    const [loadingMsg, setLoadingMsg] = useState(false);
    const [referralSelect, setReferralSelect] = useState(profileData.referred_by ? profileData.referred_by : null);
    const [referralOther, setReferralOther] = useState(profileData.referred_by_other ? profileData.referred_by_other : false);
    const referredbyRef = useRef(null);


    const onSubmit = (data) => {
        setLoadingMsg(true);
        stepSubmit(data);
    };

    const handleReferralChange = () => {
        let values = getValues();
        let refBy = values.referred_by;
        if(refBy == "other"){
            setReferralOther(true);
        }else {
            setReferralOther(false);
        }
    }
    
    return (
        <div className={styles.container}>
            <Head>
                <title>complete your profile</title>
                <meta name="description" content="aBreak58 profile" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {loadingMsg==true &&
                <div className="fixed z-[9999] top-0 left-0 text-center flex justify-center items-center w-screen h-screen bg-white/75">
                    <img src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2022/01/abreak-loading-animation-white.svg`} width="100" height="auto"/>
                </div>
            }
            <div className="w-full lg:px-10 py-4 lg:px-[10vw]">
                
                <form className="abreak-form" onSubmit={handleSubmit(onSubmit)}> 

                    <div className="mb-4 relative">
                        <label htmlFor="artist_bio" className="text-center">bio <em>(please tell us about yourself)</em></label>
				        <p className="text-slate-700"><em>min: 50 characters, max: 1,500 characters</em></p>
                        <textarea
                            name="artist_bio"
                            className="block w-[100%] h-[200px] mt-6"
                            {...register('artist_bio', {
                                required: "bio must be at least 50 characters",
                                minLength: {
                                    value: 50,
                                    message: "bio must be at least 50 characters"
                                },
                                maxlength: {
                                    value: 1500,
                                    message: "bio cannot be longer than 1,500 characters"
                                }
                            })}
                            defaultValue={profileData.artist_bio}
                        ></textarea>
                        {errors.artist_bio && (<span className="form-error">{errors.artist_bio.message}</span>)}
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="referred_by" className="text-center">how did you hear about us?</label>
                        <select
                            name="referred_by" 
                            ref={referredbyRef}
                            defaultValue={referralSelect}
                            {...register('referred_by', {
                                required: "this field is required",
                                onChange: (e)=>handleReferralChange()
                            })}
                        >
                            <option key="referral-none" value="">Select One</option>
                            <option key="referral-insta" value="instagram">instagram</option>
                            <option key="referral-tiktok" value="tik tok">tik tok</option>
                            <option key="referral-twitter" value="twitter">twitter</option>
                            <option key="referral-other" value="other">other</option>
                        </select>
                        {errors.referred_by && (<span className="form-error">{errors.referred_by.message}</span>)}
                    </div>
                    {referralOther && (
                        <div className="mb-4 relative">
                            <label htmlFor="referred_by" className="text-center mr-2">other?</label>
                            <input
                                name="referred_by_other" 
                                defaultValue={profileData.referred_by_other}
                                {...register('referred_by_other')}
                            />
                        </div>
                    )}
                    <div className="w-full flex items-center justify-between">
                        <button className="btn-primary" onClick={prevClick}><FaChevronLeft />&nbsp;prev</button>
                        <button className="btn-primary" type="submit">next&nbsp;<FaChevronRight /></button>
                    </div>
                </form>
                
            </div>
        </div>
    )
}