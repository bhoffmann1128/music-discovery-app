import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import {useRouter} from 'next/router';
import CenterFooter from '../components/centerFooter';
import ChangePasswordForm from '../components/ChangePasswordForm';

export default function Page() {
  return (
    <div>
      <Head>
        <title>aBreak music - login</title>
        <meta name="description" content="aBreak music - change password" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="h-[100vh] flex flex-col items-center justify-center pt-10">

            <ChangePasswordForm></ChangePasswordForm>
            <CenterFooter></CenterFooter>

        </div>
    </div>
  )
}