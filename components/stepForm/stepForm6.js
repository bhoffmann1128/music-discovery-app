import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from '../../styles/StepForm.module.css'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import 'react-image-crop/dist/ReactCrop.css'

export default function Step6({profileData, stepSubmit, prevClick}){

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
            <div className="w-full lg:px-10 py-2 lg:px-[5vw]">
                
                <form className="abreak-form" onSubmit={handleSubmit(onSubmit)}> 

                    <div className="p-3 text-center mb-4">
                        <p><strong>social media is a way for us to get to know more about you. the number of followers you have is not important to us. we are, however, looking for passion and growth, in whatever form(s) - be it from you, your fans, whoever/whatever.</strong></p>
                    </div>
                    <div className="flex lg:flex-row flex-col items-start justify-between">
                        <div className="pr-2 lg:w-[50%]">
                            <h2 className="text-xl mb-4">tell us where to find your music</h2>
                            <div className="mb-4 relative">
                                <label htmlFor="artist_website" className="block">artist website (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="artist_website" 
                                    defaultValue={profileData.artist_website}
                                    {...register('artist_website')}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="spotify_link" className="block">spotify link (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="spotify_link" 
                                    defaultValue={profileData.spotify_link}
                                    {...register('spotify_link')}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="apple_music" className="block">apple music (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="apple_music" 
                                    defaultValue={profileData.apple_music}
                                    {...register('apple_music')}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="youtube_link" className="block">youtube link (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="youtube_link" 
                                    defaultValue={profileData.youtube_link}
                                    {...register('youtube_link')}
                                />
                            </div>
                        </div>
                        <div className="pl-2 lg:w-[50%]">
                            <h2 className="text-xl mb-4 mt-6 lg:mt-0">tell us who you are on social media</h2>
                            <div className="mb-4 relative">
                                <label htmlFor="instagram" className="block">instagram (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="instagram" 
                                    defaultValue={profileData.instagram}
                                    {...register('instagram')}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="tik_tok" className="block">tik tok (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="tik_tok" 
                                    defaultValue={profileData.tik_tok}
                                    {...register('tik_tok')}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="twitter" className="block">twitter (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="twitter" 
                                    defaultValue={profileData.twitter}
                                    {...register('twitter')}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="facebook" className="block">facebook (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="facebook" 
                                    defaultValue={profileData.facebook}
                                    {...register('facebook')}
                                />
                            </div>
                        </div>
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