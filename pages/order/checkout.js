import Head from 'next/head';
import React, { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from '../../components/CheckoutForm'
import FullWidthLayout from '../../components/fullWIdthLayout'
import cookie from 'cookie'
import {getArtistAccount} from '../api/getArtistAccount'
import { getArtistProfile } from '../api/getArtistProfile'

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export async function getServerSideProps(context) {

  if(context.req.headers.cookie){
    let userInfo = cookie.parse(context.req.headers.cookie);
    if(!userInfo.abreakmusic_token){
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
        props:{},
      };
    }
  }else {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props:{},
    };
  }

  let userInfo = cookie.parse(context.req.headers.cookie);
  let senddata = {};
  senddata.token = userInfo.abreakmusic_token;
  senddata.username = userInfo.abreakmusic_username;
  senddata.action = "get";
  senddata.role = "artist";
  
  const artistdata = await getArtistProfile(senddata);
  const artistAccountData = await getArtistAccount(senddata);

  
  //if artist has an active subscription, not need to checkout
  if(artistAccountData && artistAccountData[0].subscription_status == "active" ){
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
      props:{},
    };
  }


  return {
    props: {accountData: artistAccountData ?  artistAccountData[0] : null, artistData: artistdata.results[0]}, // will be passed to the page component as props
  }

}


export default function Page(props) {

  
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntent, setPaymentIntent] = useState('');
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads using our local API
    fetch('../api/stripe/createPaymentIntent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 300,
        payment_intent_id: '',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("PAYMENT INTENT", data);
        setClientSecret(data.client_secret), setPaymentIntent(data.id);
      });
  }, []);

  const appearance = {
    theme: 'stripe',
    labels: 'floating',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="px-14 py-4">
      <Head>
        <title>aBreak premium - checkout</title>
      </Head>
      <h1 className="text-3xl blue-shadow bold mb-4 mt-4 text-center">
        aBreak premium checkout
      </h1>
      {clientSecret && (
        <Elements options={options} stripe={stripe}>
          <CheckoutForm paymentIntent={paymentIntent} artistData={props.artistData} accountData={props.accountData} />
        </Elements>
      )}
    </div>
  );
}

Page.getLayout = function getLayout(page) {
    return (
      <FullWidthLayout>
        {page}
      </FullWidthLayout>
    )
  }