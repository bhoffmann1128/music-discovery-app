import cookie from 'cookie'
import { useEffect, useState } from 'react'
import ErrorModal from '../../components/errorModal'
import DashboardTop from '../../components/dashboardTop'
import Moment from 'react-moment';
import { useRouter } from 'next/router'
import ConfirmationModal from '../../components/confirmationModal'
import { getArtistAccount } from '../api/getArtistAccount'
import { getArtistProfile } from '../api/getArtistProfile'
import { getGenres } from '../api/getGenres'
import { CardElement, Elements, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'
import UpdateCreditCardForm from '../../components/updateCreditCardForm'
import Link from 'next/link';

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

    console.log(props.subscription);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorContent, setErrorContent] = useState(null);
    const [confirmationMessage, setConfirmationMessage] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const decPrice = props.subscription ? props.subscription.items.data[0].price.unit_amount * .010 : null;
    const formattedPrice = decPrice ? decPrice.toFixed(2) : null;
    const router = useRouter(); 
    const refreshData = () => {
      router.replace(router.asPath);
    }

    const handleUpgradeAccount = () => {
        router.push("/order/checkout");
    }

    const confirmCancelSubscription = () => {
      let senddata = {
          subscription_id: props.subscription.id
        }
        const cancel = fetch("../api/stripe/cancelStripeSubscription", {
          method: 'post',
          headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          }),
          body: JSON.stringify(senddata)
      }).then((res) => res.json())
      .then(async (data) => {
          if(data.data.cancel_at_period_end == true){
            refreshData();
          }
          setShowConfirmationModal(false);
      });
      
    }

    const handleCancelSubscription = () => {
        let message = <><h2 className="text-xl bold">confirm cancelation</h2><p>you will be able to access your premium account until the next payment cycle</p></>;  
        setConfirmationMessage(message);
        setShowConfirmationModal(true);
    }

    const handleUpdatePaymentClick = () => {
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
    

    return (
        <div className="w-full">
            <DashboardTop props={props}></DashboardTop>
            <div className="dashboard-bottom px-10 py-4">
                <h2 className="text-2xl  border-b-2 pb-2 mb-4">account info</h2>
                {props.subscription && (
                    <>
                        <h3 className="mt-4"><span className="pr-1 text-slate-500">status:</span> {props.subscription.status}</h3>
                        {props.subscription.status == "active" ? (
                          <>
                            <h3 className="mt-1"><span className="pr-1 text-slate-500">subscription type:</span> {props.subscription.interval == "month" ? ("monthly"):("yearly")}</h3>
                            <h3 className="mt-1"><span className="pr-1 text-slate-500">price:</span> ${formattedPrice}/year</h3>
                          </>
                        ):(
                          null
                        )}
                        {props.subscription.cancel_at_period_end == false && (
                          <>
                            <div className="mt-1"><em>You will be charged again on:
                                <Moment unix format="MM/DD/YYYY" className="ml-2">
                                    {props.subscription.current_period_end}
                                </Moment>
                                </em>
                            </div>
                            <div className="mt-1">
                              <h3 className="border-b-2 border-t-2 mt-6 py-2 mb-4">billing details</h3>
                              <span className="capitalize">{props.billingDetails.data[0].card.brand}</span> credit card ending in {props.billingDetails.data[0].card.last4}. Expires {props.billingDetails.data[0].card.exp_month}/{props.billingDetails.data[0].card.exp_year}
                            </div>
                            <div className="flex items-center mt-4">
                              <button className="yellow-button mr-2" onClick={handleCancelSubscription}>cancel subscription</button>
                              <button onClick={handleUpdatePaymentClick} className="yellow-button">update payment method or switch plans</button>
                            </div>
                          </>
                        )}
                        {props.subscription.cancel_at_period_end == true && (
                          <div className="mt-1"><em>your premium account will be cancelled on
                              <Moment unix format="MM/DD/YYYY" className="ml-2">
                                  {props.subscription.current_period_end}
                              </Moment>
                              </em>
                              <button className="yellow-button mt-4" onClick={handleUpgradeAccount}>renew account</button>
                          </div>
                        )}
                    </>
                )}

                {props.subscription == false ? (
                    <>
                    <h3 className="mt-4"><span className="pr-1 text-slate-500">status:</span> free account</h3>
                    <button className="yellow-button" onClick={handleUpgradeAccount}>upgrade account</button>
                    </>
                ):null}
                
                
                
            </div>

            <ErrorModal
                onClose={() => setShowErrorModal(false)}
                show={showErrorModal}
                content={errorContent}
            ></ErrorModal>
            <ConfirmationModal
              message={confirmationMessage}
              onClose={() => setShowConfirmationModal(false)}
              show={showConfirmationModal}
              onSubmit={confirmCancelSubscription}
              onCancel={() => setShowConfirmationModal(false)}
            ></ConfirmationModal>
            
        </div>
    )
}