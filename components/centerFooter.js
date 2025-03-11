import Link from "next/link";

export default function CenterFooter({type="horizontal"}){

    return (
        <>
        {type=="horizontal" ? (
            <div className={`${type} center-footer m-auto w-full md:w-[60%] mt-2 text-[.8em] px-10 border-solid border-slate-200 pt-2 border-t-4 flex justify-between items-center text-gray-500`}>
                <Link href="/faq" ><em>faq</em></Link>
                <Link href="/contact-us" ><em>contact us</em></Link>
                <Link href="/privacy-policy" ><em>privacy policy</em></Link>
                <Link href="/terms-conditions" ><em>terms of service</em></Link>
            </div>
        ):(
            <div className={`${type} center-footer relative hidden md:block md:absolute bottom-0 pr-[30px] pt-2 pb-[20px] right-8 w-[30%] absolute text-[.8em] text-right flex-col text-gray-500`}>
                <Link href="/faq" ><em>faq</em></Link>
                <Link className="block w-full"  href="/contact-us" ><em>contact us</em></Link>
                <Link className="block w-full"  href="/privacy-policy" ><em>privacy policy</em></Link>
                <Link className="block w-full"  href="/terms-conditions" ><em>terms of service</em></Link>
                
            </div>
        )}
        </>
    )
}