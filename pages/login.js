import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import {useRouter} from 'next/router';
import CenterFooter from '../components/centerFooter';
import LoginForm from '../components/loginForm';
import { useEffect, useState } from 'react';

export default function Page() {

  const [loginMessage, setLoginMessage] = useState(null);
  
  useEffect(()=>{
    let t = new URLSearchParams(window.location.search).get('password-reset');
    if(t){
      setLoginMessage("your password has been reset");
    }
  },[])
  return (
    <div className={styles.container}>
      <Head>
        <title>aBreak music - login</title>
        <meta name="description" content="aBreak music - login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="h-[100vh] flex flex-col items-center justify-center pt-10">
            {loginMessage && (
              <h2 className="bg-green-500 text-white rounded px-10 py-4 mb-6">{loginMessage}</h2>
            )}
            <h2 className="blue-shadow text-6xl text-center pb-2">hello<br/>again.</h2>
            <LoginForm></LoginForm>
            <CenterFooter></CenterFooter>

        </div>

      
    </div>
  )
}