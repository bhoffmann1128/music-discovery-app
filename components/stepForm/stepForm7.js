import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from '../../styles/StepForm.module.css'
import {FaChevronLeft, FaChevronRight, FaCheckCircle} from 'react-icons/fa'
import 'react-image-crop/dist/ReactCrop.css'
import SubscriptionSelectModal from "../subscriptionSelectModal";
//import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
//const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
//const stripePromise = loadStripe(publishableKey);

export default function Step7({profileData, stepSubmit, prevClick, genres}){

    const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();
    const [loadingMsg, setLoadingMsg] = useState(false);
    const [serviceLevel, setServiceLevel] = useState("premium");
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [subscriptionType, setSubscriptionType] = useState(null);
    
      const router = useRouter();

    const onSubmit = (data) => {
        //setLoadingMsg(true);
        if(serviceLevel=="premium"){
            setShowSubscriptionModal(true);
        }else {
            router.push("/dashboard");
        }
        //setLoadingMsg(true);
        //stepSubmit(data);
        
    };

    const subscriptionSelect = (type) => {
        setSubscriptionType(type);
        router.push({
            pathname: '/order/checkout',
            query: { subscription: subscriptionType },
        });
        //createCheckOutSession(type);
    }

    const handleServiceSelect = (type) => {
        setServiceLevel(type);
    }

    /*const createCheckOutSession = async (type) => {
        const stripe = await stripePromise;
        const checkoutSession = fetch("../api/stripe/createStripeSession", {
          method: 'post',
          headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
          body: JSON.stringify({item: product, type: type})
        }).then((res) => res.json())
        .then(async (data) => {
          stripe.redirectToCheckout({
            sessionId: data.data.id,
          });
        });
      };*/

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
            <div className="w-full px-10 py-5">
                
                <form className="abreak-form" onSubmit={handleSubmit(onSubmit)}> 

                    <div className="mb-4 relative">
                        <h2 className="text-2xl text-center mb-4">select a service level</h2>
                        <div className="service-select w-full flex items-stretch justify-evenly">
                            <div className="px-3 w-[50%]">
                                <button type="button" onClick={(e) => setServiceLevel("basic")} className={serviceLevel == "basic" ? ("active"): null}>
                                    <div className="service-select-icon"><FaCheckCircle /></div>
                                    <h2>basic</h2>
                                    <ul>
                                        <li className="service-price">free</li>
                                        <li>2 song upload</li>
                                        <li>human a&r</li>
                                        <li>playlist eligible</li>
                                    </ul>
                                    <small><em>can updgrade any time</em></small>
                                </button>
                            </div>
                            <div className="px-3 w-[50%]">
                                <button type="button" onClick={(e) => setServiceLevel("premium")} className={serviceLevel == "premium" ? ("active"): null}>
                                    <div className="service-select-icon"><FaCheckCircle /></div>
                                    <h2 className="blue-shadow">premium</h2>
                                    <ul>
                                        <li className="service-price">$2.50 / month</li>
                                        <li>10 song upload</li>
                                        <li>unlimited deletes</li>
                                        <li>newsletter subscription</li>
                                        <li>human a&r</li>
                                        <li>playlist eligible</li>
                                        <li>more premium features coming soon</li>
                                    </ul>
                                    <small><em>monthly and yearly plans available</em></small>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-between">
                        <button className="btn-primary" onClick={prevClick}><FaChevronLeft />&nbsp;prev</button>
                        <button className="btn-primary" type="submit">next&nbsp;<FaChevronRight /></button>
                    </div>
                </form>
                <SubscriptionSelectModal
                    show={showSubscriptionModal}
                    onClose={() => setShowSubscriptionModal(false)}
                    subscriptionSelect={subscriptionSelect}
                ></SubscriptionSelectModal>
            </div>
        </div>
    )
}