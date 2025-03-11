import Link from "next/link";

export default function RegisterCallout(){
    return (
        <div className="w-full px-[8vw] py-10 register-callout text-center flex flex-col items-center justify-center">
            <h2>register & upload your music to give yourself a chance – it’s free.</h2>
            <button className="yellow-button mt-4"><Link href="/register">register</Link></button>
        </div>
    )
}