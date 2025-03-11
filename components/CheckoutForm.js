import React, { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  CardElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import { useForm } from "react-hook-form";
import { FaCheckCircle } from 'react-icons/fa';
import PaymentResultModal from './PaymentResultModal';
import { useRouter } from 'next/router';
import {useCookies} from 'react-cookie';

export default function CheckoutForm({paymentIntent, artistData, accountData}) {

  const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [locAmount, setLocAmount] = useState('3.50');
  const [message, setMessage] = useState(null);
  const [priceId, setPriceId] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState("monthly");
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [error, setError] = useState(null);
  const [resultModalType, setResultModalType] = useState(null);
  const [cookies, removeCookie] = useCookies(['username', 'token']);
  const [billingAddress, setBillingAddress] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  console.log("AD", accountData);
  console.log("ARTIST", artistData);
  //use case 1
  //subscription_status: "cancelled"
  //subscription_type: "monthly"
  //user can renew current monthly subscription
  //user can update to yearly subscription

  //use case 2
  //subscription_status: null
  //user can create a new subscription

  //use case 3
  //subscription_status: "cancelled"
  //subscription_type: "yearly"
  //check subscription, if still active, then redirect
  //redirect user
  
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

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleAmount = async (val) => {
    setLocAmount(val);
    fetch('../api/stripe/createPaymentIntent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: val * 100,
        payment_intent_id: paymentIntent.paymentIntent,
      }),
    });
  };

  const createSubscription = async(customerId) => {
    let senddata = {
        customerId: customerId,
        priceId: priceId,
        artistId: artistData.id
    }
    let fetchUrl = "../api/stripe/createStripeSubscription";
    const subscription = await fetch(fetchUrl, {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify(senddata)
    });
    const subscriptionData = await subscription.json();
    return subscriptionData;
  }

  const createCustomer = async() => {
    let senddata = {
        email: email,
        name: name,
        artist_id: artistData.id
    }
    if(accountData && accountData.customer_id){
      senddata.customer_id = accountData.customer_id;
    }
    const customer = await fetch(`../api/stripe/createCustomer`, {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify(senddata)
    });
    const customerData = await customer.json();
    return customerData;
  }

  const getCustomerData = async(id) => {
    let senddata = {
      customer_id: id
    }
    const customer = await fetch(`../api/stripe/getCustomer`, {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify(senddata)
    });
    const customerData = await customer.json();
    console.log(customerData);
    setCustomerData(customerData.customer);
  }

  
  const onSubmit = async(data) => {
    
    setLoadingMsg(true);
    let customer = "";
    if(!customerData){
      customer = await createCustomer();
    }else {
      customer = customerData;
    }
    

    let subscription = await createSubscription(customer.customer.id);
    let subscriptionId = subscription.subscriptionId;


    if (!stripe || !elements) {
      console.log('not loaded');
      // Stripe.js has not yet loaded.
      return;
    }

    const stripePayload = await stripe.confirmCardPayment(
        subscription.clientSecret, // returned by subscribe endpoint
        {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                  name: name,
                  address: billingAddress,
                  email: email
                }
            }    
        }
    )

    
    if(stripePayload.paymentIntent && stripePayload.paymentIntent.status == "succeeded"){
        //record payment intent and other information in account data
        
        let senddata = {
            customer_id: customer.customer.id,
            subscription_id: subscription.subscriptionId,
            subscription_type: paymentFrequency,
            payment_intent: stripePayload.paymentIntent.id,
            status: "active"
        }
        
        const update = await fetch(`../api/updateAccountInfo`, {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(senddata)
        });
        const updateData = await update.json();

        sendEmail();
        setResultModalType("success");
        setShowResultModal(true);
        setLoadingMsg(false);

        
    }
    if (stripePayload.error) {
        setLoadingMsg(false);
        setResultModalType("error");
        setErrorMessage(stripePayload.error.message);
        setShowResultModal(true);
        setError(stripePayload.error.message);
    }
  };

  
  const sendEmail = () => {
    let senddata = {};
    senddata.type = "premium-signup";

    const sendmail = fetch("../api/sendMail", {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify(senddata)
    }).then((res) => res.json())
    .then((data) => {
        console.log("sendmail result:", data);
        router.push("/dashboard");
        setLoadingMsg(false);
    });
  }

  useEffect(() => {
    if(paymentFrequency == "monthly"){
        setPriceId(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICEID);
    }
    if(paymentFrequency == "yearly"){
        setPriceId(process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICEID);
    }

  }, [paymentFrequency])

  const getSubscriptionData = async (id) => {
    let senddata = {
      subscription_id: id
    };
    const subscription = await fetch(`../api/stripe/getStripeSubscription`, {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify(senddata)
    });
    const subscriptionData =  await subscription.json();
    setSubscriptionData(subscriptionData);
  }

  useEffect(() => {
    if(accountData && accountData.subscription_id){
      getSubscriptionData(accountData.subscription_id);
    }
    if(accountData && accountData.customer_id){
      getCustomerData(accountData.customer_id);
    }
  }, [accountData]);

  useEffect(() => {
    if(router.query){
        if(router.query.subscription){
            setPaymentFrequency(router.query.subscription);
        }
      }
  },[router.query])

  const handleResultSubmit = () => {
    router.push("/dashboard");
  }

  const addressChange = () => {
    let addressElement = elements.getElement('address');
    addressElement.getValue().then(function(result) {
      console.log(result);
      if (result.complete) {
        setBillingAddress(result.value.address);
        setName(result.value.name);
        // Allow user to proceed to the next step
        // Optionally, use value to store the address details
      }
    });
  }


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
            <AddressElement options={{mode: 'billing'}} className="mb-4" onChange={addressChange} />
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
      <PaymentResultModal
        show={showResultModal}
        onClose={() => setShowResultModal(false)}
        errormessage={errorMessage}
        type={resultModalType}
        onSubmit={()=>handleResultSubmit()}
      ></PaymentResultModal>
    </>
  );
}