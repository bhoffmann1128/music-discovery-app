import cookie from 'cookie'
import { useEffect, useState } from 'react'
import ErrorModal from '../../components/errorModal'
import DashboardTop from '../../components/dashboardTop'
import Moment from 'react-moment';
import { useRouter } from 'next/router'
import { getArtistAccount } from '../api/getArtistAccount'
import { getArtistProfile } from '../api/getArtistProfile'
import { getGenres } from '../api/getGenres'
import { CardElement, Elements, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'
import { useForm } from 'react-hook-form';
import UpdateCreditCardForm from '../../components/updateCreditCardForm';

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export async function getServerSideProps(context) {
  let userInfo = cookie.parse(context.req.headers.cookie);
  let senddata = {};
  senddata.token = userInfo.abreakmusic_token;
  senddata.username = userInfo.abreakmusic_username;
  senddata.action = "get";
  senddata.role = "artist";
  
    const artistdata = await getArtistProfile(senddata);

    if(!artistdata || artistdata.status == "ERROR"){
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
          props:{},
        };
      }
    
    const artistAccountData = await getArtistAccount(senddata);
    const genreResult = await getGenres();

    let subscription = false;
    let paymentMethods = null;
    
    if(artistAccountData.length > 0){
        let subdata = {
            subscription_id: artistAccountData[0].subscription_id
        }
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        subscription = await stripe.subscriptions.retrieve(
          artistAccountData[0].subscription_id
        );


        //get payment methods        
         paymentMethods = await stripe.paymentMethods.list({
          customer: subscription.customer,
          type: 'card',
        });
        
    }

  return {
    props: {data: artistdata.results[0],genres: genreResult, account: artistAccountData, subscription: subscription, billingDetails: paymentMethods}, 
  }
}

export default function Page(props) {

    const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorContent, setErrorContent] = useState(null);
    const decPrice = props.subscription ? props.subscription.items.data[0].price.unit_amount * .010 : null;
    const router = useRouter(); 

    const refreshData = () => {
      router.replace(router.asPath);
    }

    const onSubmit = async(data) => {
        console.log(data);
        console.log(props.account[0].customer_id);
        fetch('../api/stripe/getCustomerPortal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerid: props.account[0].customer_id
            }),
          }).then((res) => res.json())
        .then((data) => {
            console.log(data);
            window.location.href = data.session.url;
        });
    }

    useEffect(() => {
        let senddata = {
            payment_intent_id: props.account.payment_intent,
            amount: "350"
        }
    },[]);

    return (
        <div className="w-full">
            <DashboardTop props={props}></DashboardTop>
            <div className="dashboard-bottom px-10 py-4">
                <h2 className="text-2xl  border-b-2 pb-2 mb-4">update payment method</h2>
                {props.subscription && (
                    <>
                        <Elements stripe={stripe}>
                            <UpdateCreditCardForm 
                                formSubmit={onSubmit}
                                subscription={props.subscription}
                            ></UpdateCreditCardForm>
                        </Elements>
                    </>
                )}

            </div>

            <ErrorModal
                onClose={() => setShowErrorModal(false)}
                show={showErrorModal}
                content={errorContent}
            ></ErrorModal>
            
        </div>
    )
}