import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styles from '../../styles/StepForm.module.css'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import 'react-image-crop/dist/ReactCrop.css'
import states from "../../helpers/states.json"
import countries from "../../helpers/countries.json"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export default function Step5({profileData, stepSubmit, prevClick, genres}){

    const { register, handleSubmit, watch, getValues,setValue,setError, clearErrors, formState: { errors } } = useForm();
    const [phoneValue, setPhoneValue] = useState()
    const [loadingMsg, setLoadingMsg] = useState(false);
    const [stateSelect, setStateSelect] = useState(profileData.state);
    const [stateValid, setStateValid] = useState(true);
    const [countrySelect, setCountrySelect] = useState(profileData.country == "" ? null : profileData.country);
    
    const countrySelectRef = useRef(null);
    const stateSelectRef = useRef(null);
    
    const onSubmit = (data) => {
        
        if(countrySelect == null || stateSelect == null){
            
            if(countrySelect == null){
                setError('country', {type: 'required', message: "select a country"});
            }
            if(stateSelect == null && countrySelect == "US"){
                setError('state', {type: 'required', message: "select a state"});
            }
        }else {
            data.country = countrySelect;
            setLoadingMsg(true);
            if(data.country != "US"){
                data.state = null;
            }
            stepSubmit(data);
        }
        
    };
    const handleCountryChange = () => {
        let countrySelected = countrySelectRef.current.value;
        let stateSelected = stateSelectRef.current?.value;
        
        setCountrySelect(countrySelected);
        if(countrySelected != "US"){
            setStateSelect("");
            setStateValid(false);
        }else {
            setStateValid(true);
        }
    }
    const handleStateChange = () => {
        let stateSelected = stateSelectRef.current.value;
        if(stateSelected == null){
            setError('state', {type: 'required', message: "select a state"});
        }else {
            clearErrors('state', 'required');
        }
        setStateSelect(stateSelected);
    }

    useEffect(() => {
        setValue("state", stateSelect);
    }, [stateSelect]);

    useEffect(() => {
        if(countrySelect != "US"){
            clearErrors('state', 'required');
            setStateValid(false);
        }else {
            setStateValid(true);
        }
    }, [countrySelect]);


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
            <div className="w-full lg:px-10 py-5 lg:px-[10vw]">
                
                <form className="abreak-form" onSubmit={handleSubmit(onSubmit)}> 
                    <div className="flex lg:flex-row flex-col items-start justify-between mb-4">
                        <div className="lg:pr-5">
                            <label htmlFor="city" className="block">city</label>
                            <input 
                                type="text" 
                                name="city" 
                                defaultValue={profileData.city}
                                {...register('city', {
                                    required: "city is required",
                                })}
                            />
                            {errors.city && (<span className="form-error">{errors.city.message}</span>)}
                        </div>
                        {stateValid ? (
                        <div className="lg:pr-5">
                            <label htmlFor="state" className="block">state</label>
                            <select
                                name="state" 
                                defaultValue={stateSelect}
                                value={stateSelect}
                                {...register('state', {
                                    onChange: (e)=>handleStateChange()
                                })}
                                ref={stateSelectRef}
                            >
                                <option key="state-none" value=""></option>
                                {states && states.map((state) => {
                                    return (
                                        <option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
                                    )
                                })}
                            </select>
                            {errors.state && (<span className="form-error">{errors.state.message}</span>)}
                        </div>
                        ):null}
                        <div className="lg:px-5">
                            <label htmlFor="country" className="block">country</label>
                            <select
                                name="country" 
                                defaultValue={profileData.country}
                                {...register('country',
                                    {onChange:(e) => handleCountryChange()}
                                )}
                                ref={countrySelectRef}
                            >
                                <option key="no-country" value=""></option>
                                {countries && countries.map((country, i) => {
                                    return (
                                        <option key={country.code + i} value={country.code}>{country.name}</option>
                                    )
                                })}
                            </select>
                            {errors.country && (<span className="form-error">{errors.country.message}</span>)}
                        </div>
                    </div>
                    <div className="flex lg:flex-row flex-col items-center mb-4 mt-5">
                        <div className="lg:w-[50%] lg:pr-4">
                            <label htmlFor="cellphone" className="block">cell phone</label>
                            <PhoneInput 
                                type="tel" 
                                name="cellphone" 
                                value={profileData.cellphone}
                                {...register('cellphone')}
                                onChange={setPhoneValue}
                                defaultCountry="US"
                                className="phone-input"
                            />
                            {errors.cellphone && (<span className="form-error">{errors.cellphone.message}</span>)}
                        </div>
                        <div className="lg:w-[50%] lg:pl-4 py-4 lg:py-0 flex-column justify-center">
                            <div>
                                <input
                                    type="checkbox" 
                                    name="permission_to_text" 
                                    defaultValue={profileData.premission_to_text}
                                    {...register('permission_to_text')}
                                />
                                <label htmlFor="permissiontotext" className="pl-2">permission to text</label>
                            </div>
                            <div>
                                <p><em>aBreak music may use text to contact an artist about being on the playlist or other inquiries. read our terms & conditions</em></p>
                            </div>
                            {errors.cellphone && (<span className="form-error">{errors.cellphone.message}</span>)}
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