import { useState } from "react"
import { FaCheckCircle } from "react-icons/fa"

export default function Page({props}){
    const [accountType, setAccountType] = useState("premium");


    return (
        <div className="service-select mb-4 relative flex justify-between">
            <button 
                type="button" 
                className={accountType == "free" ? "active" : null}
                onClick={() => setAccountType("free")}
            >
                <div className="mb-2 text-center service-select-icon"><FaCheckCircle /></div>
                <h3>basic</h3>
                <ul>
                    <li>free</li>
                    <li>2 uploads</li>
                    <li>human a&r</li>
                    <li>playlist eligible</li>
                </ul>
            </button>
            <button 
                type="button" 
                className={accountType == "premium" ? "active" : null}
                onClick={() => setAccountType("premium")}
            >
                    <div className="mb-2 text-center service-select-icon"><FaCheckCircle /></div>
                    <h3>premium</h3>
                    <ul>
                        <li>$2.50/month</li>
                        <li>10 uploads</li>
                        <li>newsletter</li>
                        <li>human a&r</li>
                        <li>playlist eligible</li>
                        <li>cancel anytime</li>
                    </ul>
            </button>
        </div>
    )
}