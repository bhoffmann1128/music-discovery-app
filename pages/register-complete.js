import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import {useRouter} from 'next/router';
import CenterFooter from '../components/centerFooter';
import { useState } from 'react';

export default function Page() {

  const [emailSent, setEmailSent] = useState(false);

  const handleResendEmail = () => {
    let senddata = {};
    senddata.type = "registration";

    const sendmail = fetch("../api/sendMail", {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify(senddata)
    }).then((res) => res.json())
    .then((data) => {
        setEmailSent(true);
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>aBreak music - registration complete</title>
        <meta name="description" content="aBreak music - registration complete" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="h-[100vh] flex flex-col items-center justify-center">
            
            <div className="mt-12 mb-10">
              <div className="text-center mb-10">
                  <h2 className="text-[1.5em] pb-3">thank you for registering with aBreak music</h2>
                  <div className="blue-callout px-25 py-3 text-white"><em>click the link in your email to complete your registration</em></div>
              </div>

              <div className="text-center">
                  <h4 className="text-[1.2em]"><strong><em>didn't receive the confirmation?</em></strong></h4>
                  <p className="text-gray-500"><em>be sure to check your spam folder</em></p>
                  {emailSent == false ? (
                    <button className="yellow-button mt-5 mx-auto" onClick={handleResendEmail}>resend email</button>
                  ):(
                    <p className="bg-purple-600 text-white py-2 text-center px-10">email has been sent.</p>
                  )}
              </div>
            </div>
            
            <CenterFooter></CenterFooter>
            
        </div>

      
    </div>
  )
}
