import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styles from '../../styles/StepForm.module.css'
import 'react-image-crop/dist/ReactCrop.css'
import 'react-image-crop/dist/ReactCrop.css'
import { useRouter } from "next/router";
import Step1 from "../../components/stepForm/stepForm1";
import Step2 from "../../components/stepForm/stepForm2";
import Step3 from "../../components/stepForm/stepForm3";
import Step4 from "../../components/stepForm/stepForm4";
import Step5 from "../../components/stepForm/stepForm5";
import Step6 from "../../components/stepForm/stepForm6";
import Step7 from "../../components/stepForm/stepForm7";
import cookie from "cookie";
import StepGuide from "../../components/stepForm/stepGuide";
import { getArtistProfile } from "../api/getArtistProfile";
import { getGenres } from "../api/getGenres";

export async function getServerSideProps(context) {
    
    let userInfo = cookie.parse(context.req.headers.cookie);
    let senddata = {};
    senddata.token = userInfo.abreakmusic_token;
    senddata.username = userInfo.abreakmusic_username;
    senddata.action = "get";
    senddata.role = "artist";

    const artistdata = await getArtistProfile(senddata);

    if(!artistdata || artistdata.status == "ERROR"){
        //await fetch(`${process.env.APP_URL}/api/logout`);
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
          props:{},
        };
      }

    const genreResult = await getGenres();
    
    return {
      props: {data: artistdata.results[0], genres: genreResult}, 
    }
  }


export default function Page(props){

    const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();
    const [formStep, setFormStep] = useState(1);
    const [loadingMsg, setLoadingMsg] = useState(false);
    const [formData, setFormData] = useState({
            "artistname": null,
            "artistimage": null,
            "city": null,
            "state": null,
            "agegroup": null,
            "gender": null,
            "country": null,
            "cellphone": null,
            "firstname": null,
            "lastname": null,
            "artist_bio": null,
            "referred_by": null,
            "permission_to_text": 0,
            "label_name": null,
            "artist_website": null,
            "youtube_link": null,
            "spotify_link": null,
            "twitter": null,
            "instagram": null,
            "tik_tok": null,
            "facebook": null,
            "apple_music": null,
            "genre" : [],
            "genre": null,
            "profileStep": 1
    });
    
    
    const router = useRouter();
    const formStep1 = useRef("formStep1");
    const formStep2 = useRef("formStep2");
    const formStep3 = useRef("formStep3");
    const formStep4 = useRef("formStep4");
    const formStep5 = useRef("formStep5");

    const handleStepSubmit = (data) => {
        setLoadingMsg(true);
        const updatedFormData = {
            ...formData,
            ...data
        };
        
        updatedFormData.profileStep = formStep;
        setFormData(updatedFormData);
        const update = fetch("../api/updateArtistProfileStep", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(updatedFormData)
        }).then((res) => res.json())
        .then(async (data) => {
            if(formStep == 6 && process.env.NEXT_PUBLIC_PREMIUM == "false"){
                router.push("/dashboard");
            }else {
                setFormStep(formStep+1);
            }
            
            setLoadingMsg(false);
        });
    }

    const handlePrevClick = () => {
        setFormStep(formStep -1);
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
            <StepGuide activeStep={formStep}></StepGuide>
            {formStep == 1 ? (
                <div className="w-full px-10">
                    <Step1 profileData={props.data} stepSubmit={handleStepSubmit}></Step1>
                </div>
            ):null}
            {formStep == 2 ? (
                <div className="w-full px-10">
                    <Step2 profileData={props.data} stepSubmit={handleStepSubmit} prevClick={handlePrevClick}></Step2>
                </div>
            ):null}
            {formStep == 3 ? (
                <div className="w-full px-10">
                    <Step3 profileData={props.data} stepSubmit={handleStepSubmit} prevClick={handlePrevClick}></Step3>
                </div>
            ):null}
            {formStep == 4 ? (
                <div className="w-full px-10">
                    <Step4 profileData={props.data} stepSubmit={handleStepSubmit} prevClick={handlePrevClick} genres={props.genres}></Step4>
                </div>
            ):null}
            {formStep == 5 ? (
                <div className="w-full px-10">
                    <Step5 profileData={props.data} stepSubmit={handleStepSubmit} prevClick={handlePrevClick}></Step5>
                </div>
            ):null}
            {formStep == 6 ? (
                <div className="w-full px-10">
                    <Step6 profileData={props.data} stepSubmit={handleStepSubmit} prevClick={handlePrevClick}></Step6>
                </div>
            ):null}
            {formStep == 7 && process.env.NEXT_PUBLIC_PREMIUM == "true" ? (
                <div className="w-full px-10">
                    <Step7 profileData={props.data} stepSubmit={handleStepSubmit} prevClick={handlePrevClick}></Step7>
                </div>
            ):null}
        </div>
    )
}