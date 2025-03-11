import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from '../../styles/StepForm.module.css'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import 'react-image-crop/dist/ReactCrop.css'

export default function Step3({profileData, stepSubmit, prevClick}){

    const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();
    const [loadingMsg, setLoadingMsg] = useState(false);

    const onSubmit = (data) => {
        setLoadingMsg(true);
        stepSubmit(data);
    };

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
            <div className="w-full lg:flex-row flex-col lg:px-10 py-5 lg:px-[10vw]">
                
                <form className="abreak-form" onSubmit={handleSubmit(onSubmit)}> 
                
                    <div className="flex lg:flex-row flex-col items-start">
                        <div className="mb-4 lg:w-[50%] lg:pr-2 relative">
                            <label htmlFor="firstname" className="block">contact first name</label>
                            <input 
                                type="text" 
                                name="firstname" 
                                className="w-full"
                                defaultValue={profileData.firstname}
                                {...register('firstname', {
                                    required: "first name is required",
                                    maxlength: {
                                        value: 50,
                                        message: "first name can't be longer than 50 characters"
                                    }
                                })}
                            />
                            {errors.firstname && (<span className="form-error">{errors.firstname.message}</span>)}
                        </div>
                        <div className="mb-4 lg:w-[50%] lg:pl-2 relative">
                            <label htmlFor="firstname" className="block">contact last name</label>
                            <input 
                                type="text" 
                                name="lastname" 
                                className="w-full"
                                defaultValue={profileData.lastname}
                                {...register('lastname', {
                                    required: "last name is required",
                                    maxlength: {
                                        value: 50,
                                        message: "last name can't be longer than 50 characters"
                                    }
                                })}
                            />
                            {errors.lastname && (<span className="form-error">{errors.lastname.message}</span>)}
                        </div>
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="agegroup">age range</label>
                        <p><small><em>(if a group, use average age)</em></small></p>
                        <select
                            name="agegroup" 
                            defaultValue={profileData.agegroup}
                            {...register('agegroup', {
                                required: "age group is required. If you are a group, then use average age.",
                            })}
                        >
                            <option value="">Select One</option>
                            <option value="16-24">16-24</option>
                            <option value="25-29">25-29</option>
                            <option value="30-34">30-34</option>
                            <option value="35+">35+</option>
                        </select>
                        {errors.agegroup && (<span className="form-error">{errors.agegroup.message}</span>)}
                    </div>
                    <div className="w-full flex items-center justify-between">
                        <button className="btn-primary" onClick={prevClick}><FaChevronLeft />&nbsp;prev</button>
                        <button className="btn-primary" type="submit">next&nbsp;<FaChevronRight /></button>
                    </div>
                </form>
                
            </div>
        </div>
    )
}