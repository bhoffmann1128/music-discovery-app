import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import {useRouter} from 'next/router';
import CenterFooter from '../../components/centerFooter';

export default function Page() {

  const router = useRouter();
  const { status } = router.query;

  return (
    <div>
      <Head>
        <title>aBreak music - order cancelation</title>
        <meta name="description" content="aBreak music - payment confirmation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="h-[100vh] flex flex-col items-center justify-center">

            <div className='text-center bg-red-100 text-red-700 p-2 rounded border mb-2 border-red-700'>
                Payment Unsuccessful
            </div>
            
            <CenterFooter></CenterFooter>

        </div>

      
    </div>
  )
}
