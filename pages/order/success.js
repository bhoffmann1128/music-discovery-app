import { loadStripe } from '@stripe/stripe-js';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import {useRouter} from 'next/router';
import CenterFooter from '../../components/centerFooter';
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
//const stripe = loadStripe(publishableKey);
const stripe = require('stripe')(publishableKey)
import cookie from "cookie";
import Stripe from 'stripe'
import { updateAccount } from '../api/updateAccountInfo';

export async function getServerSideProps(context) {

  //let userInfo = context.req.cookies;
  let userInfo = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
  let sessionId = context.query.session_id;
  /*let senddata = {
    session_id: sessionId
  }
  const getSession = await fetch(`${process.env.APP_URL}/api/stripe/getStripeSession`, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: JSON.stringify(senddata)
  });
  const sessionInfo = await getSession.json();*/

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const customer = await stripe.customers.retrieve(session.customer);
  let sessionInfo = {
    session: session,
    customer: customer
  }

  sessionInfo.token = userInfo.abreakmusic_token;
  sessionInfo.username = userInfo.abreakmusic_username;

  /*const recordSession = await fetch(`${process.env.APP_URL}/api/updateAccountInfo`, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: JSON.stringify(sessionInfo)
  });
  const accountUpdate = await recordSession.json();*/
  const accountUpdate = await updateAccount(sessionInfo);

  return {
    props: accountUpdate
  }
}

export default function Page(props) {

  const router = useRouter();
  const { status } = router.query;

  return (
    <div>
      <Head>
        <title>aBreak music - order confirmation</title>
        <meta name="description" content="aBreak music - order confirmation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="h-[100vh] flex flex-col items-center justify-center">

            <div className='text-center p-2 mb-2 text-2xl'>
               payment successful.<br/>You are now a premium member.
            </div>            
            <div className="mt-4">
              <Link href="/dashboard" className="yellow-button">go to your dashboard</Link>
            </div>
            
            <CenterFooter></CenterFooter>

        </div>

      
    </div>
  )
}
