import Head from 'next/head'
import { useState } from 'react';
import CenterFooter from '../components/centerFooter';
import ContactForm from '../components/ContactForm';
import LoginForm from '../components/loginForm';

export default function Page() {

    const [emailSent, setEmailSent] = useState(false);
    
    const handleContactSubmit = (formData) => {
        formData.type="contact";
        const sendmail = fetch("../api/sendContactForm", {
            method: 'post',
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
            body: JSON.stringify(formData)
        }).then((res) => res.json())
        .then((data) => {
            if(data.result[0].statusCode==202){
              setEmailSent(true); 
            }
        });
    }

  return (
    <div className="">
      <Head>
        <title>aBreak music - registration confirmation</title>
        <meta name="description" content="aBreak music - registration confirmation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="h-[100vh] flex flex-col items-center justify-center">
            <h1 className="page-title">contact us</h1>
            {!emailSent ? (
                <>
                    <ContactForm
                        contactSubmit={handleContactSubmit}>
                    </ContactForm>
                    <CenterFooter></CenterFooter>
                </>
            ):(
                <h2 className="text-2xl text-center">thank you for reaching out.<br/> We will be in touch.</h2>
            )}
        </div>
    </div>
  )
}