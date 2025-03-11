import React, { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import { useForm } from "react-hook-form";
import { FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function UpdateCreditCardForm({paymentIntent, formSubmit, subscription}) {

  const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState("monthly");
  const [loadingMsg, setLoadingMsg] = useState(false);

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  console.log("test", subscription);
  
  useEffect(() => {
    if (!stripe) {
      return;
    }

    //Grab the client secret from url params
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }
  },[]);


  const onSubmit = async(data) => {
    
    //setLoadingMsg(true);

    if (!stripe || !elements) {
      console.log('not loaded');
      // Stripe.js has not yet loaded.
      return;
    }

    formSubmit(data);
      console.log(elements.getElement(CardElement));
    /*
    const stripePayload = await stripe.confirmCardPayment(
        subscription, // returned by subscribe endpoint
        {
            payment_method: {
                card: elements.getElement(CardElement)
            }    
        }
    )

    console.log(stripePayload);*/

  };


  return (
    <>
      {loadingMsg==true &&
            <div className="fixed z-[9999] top-0 left-0 text-center flex justify-center items-center w-screen h-screen bg-white/75">
                <img src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2022/01/abreak-loading-animation-white.svg`} width="100" height="auto"/>
            </div>
        }
      <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="m-auto">
        <div className="flex items-center justify-between checkout-paymenttype-select text-xl mb-4">
            <button className= {paymentFrequency == "monthly" && ("active")} type="button" onClick={() => setPaymentFrequency("monthly")}>
                <FaCheckCircle />
                <h2>pay monthly</h2>
                <h4>${process.env.NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE}/month</h4>
            </button>
            <button className={paymentFrequency == "yearly" && ("active")} type="button" onClick={() => setPaymentFrequency("yearly")}>
                <FaCheckCircle />
                <h2>pay yearly</h2>
                <h4>${process.env.NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE}/year</h4>
            </button>
        </div>
        <div className="mb-6">
        <label htmlFor='name'>name <em className="text-slate-400">(as it appears on card)</em></label>
          <input
            {...register("name", {
                required: "full name is required"
            })}
            className="block
            w-full
            px-4
            mt-2
            rounded-md
            border
            border-gray-200
            shadow-sm h-16"
            id="email"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (<span className="form-error">{errors.name.message}</span>)}
        </div>
        <div className="mb-6">
          <label htmlFor='email'>your email</label>
          <input
            type="email" {...register("email", { 
                required: "email is required",
                pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Invalid email address",
                  }, 
            })}
            className="block
            w-full
            px-4
            mt-2
            rounded-md
            border
            border-gray-200
            shadow-sm h-16"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (<span className="form-error">{errors.email.message}</span>)}
        </div>
        <div className="">
            <label className="block pb-4">billing details</label>
            <CardElement id="payment-element" className="py-6 px-4 rounded text-[2em] bg-slate-100" />
        </div>
        <button
          className="mt-4 elements-style-background yellow-button"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? (
              'submitting...'
            ) : (
              'Pay now'
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}