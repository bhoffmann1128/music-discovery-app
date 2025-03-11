import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from '../../styles/StepForm.module.css'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import 'react-image-crop/dist/ReactCrop.css'

export default function Step4({profileData, stepSubmit, prevClick, genres}){

    const { register, handleSubmit, watch, getValues, setError, clearErrors, formState: { errors } } = useForm();
    const [loadingMsg, setLoadingMsg] = useState(false);

    const onSubmit = (data) => {
        setLoadingMsg(true);
        stepSubmit(data);
        
    };

    const handleGenreChange = (e) => {
        let genres =  getValues();
        
        if(genres.length > 4){
            setError('genre', {type: 'maxLength', message: "please select no more than 4 genres"});
        }
        if(genres.length < 5){
            clearErrors('genre', 'maxLength');
        }
    }

    const handleChecked = (id) => {
        if(profileData.genre){
            let genreArr = profileData.genre.split(",");
            if(genreArr.includes(id.toString())){
                return "checked";
            }
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
            <div className="w-full lg:px-10 py-2 lg:px-[10vw]">
                
                <form className="abreak-form" onSubmit={handleSubmit(onSubmit)}> 

                    <div className="mb-4 relative">
                        <label htmlFor="genre">genre</label>
                        <p><small><em>please select 1-4 genres</em></small></p>
                        <div className="genre-grid" onChange={handleGenreChange}>
                            {genres && genres.map((genre) => (
                                <div className="genre-check" key={genre.id}>
                                    <input 
                                     type="checkbox" 
                                     name="genre" 
                                     {...register('genre', {
                                        required: "at least one genre must be selected",
                                        max: {
                                            value: 4,
                                            message: "you can only select a total of 4 genres"
                                        },
                                        validate: {
                                            lessThanFive: v => {console.log(v); parseInt(v) < 5 || "no more than 4 genres accepted"},
                                        },
                                        onChange:(e) => {handleGenreChange}
                                     })}
                                     defaultChecked={handleChecked(genre.id)}
                                     value={genre.id} />
                                    <label htmlFor="genre">{genre.genre}</label>
                                </div>
                            ))}
                        </div>
                        {errors.genre && (<span className="form-error">{errors.genre.message}</span>)}
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