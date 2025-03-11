import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import {useRouter} from 'next/router';
import CenterFooter from '../components/centerFooter';
import LoginForm from '../components/loginForm';
import { confirmArtist } from './api/confirmArtist';

export async function getServerSideProps(context) {

  let resolvedUrl = context.resolvedUrl;
  let query = context.query;
  let code = query.c;
 
  const confirmData = await confirmArtist(code);
  let success = confirmData.message;
  
  return {
    props: {confirmed: success}, // will be passed to the page component as props
  }
}

export default function Page(props) {

  return (
    <div className="">
      <Head>
        <title>aBreak music - registration confirmation</title>
        <meta name="description" content="aBreak music - registration confirmation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="h-[100vh] flex flex-col items-center justify-center">
            
            <div className="text-center mt-10 mb-5 px-4">
                <h2 className="text-[1.5em]">you have been registered!</h2>
                <div><em>log in to complete your profile and begin uploading songs.</em></div>
            </div>

            <LoginForm></LoginForm>
            <CenterFooter></CenterFooter>

        </div>

      
    </div>
  )
}