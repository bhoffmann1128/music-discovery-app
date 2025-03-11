import Link from "next/link";

export default function PremiumUpgradeCallout({isLoggedIn}){
    
    return (
        <>
            {process.env.NEXT_PUBLIC_PREMIUM == "true" && (
                <div className="w-full register-callout text-center flex flex-col justify-center px-4 py-6">
                    {isLoggedIn==false ? (
                        <div>
                            <h2 className="text-center">become a premium member today</h2>
                            <h3 className="text-center">only ${process.env.NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE}/month or ${process.env.NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE}/year</h3>
                            <button className="yellow-button m-auto mt-4"><Link href="/register">register</Link></button>    
                        </div>
                    ):(
                        <div>
                            <h2 className="text-center">upgrade to aBreak premium</h2>
                            <h3 className="text-center">only ${process.env.NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE}/month or ${process.env.NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE}/year</h3>
                            <button className="yellow-button m-auto mt-4"><Link href="/order/checkout">upgrade</Link></button>    
                        </div>
                    )}
                </div>
            )}
        </>
    )
}