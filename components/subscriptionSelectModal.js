import { useState } from "react";
import {FaCheckCircle} from 'react-icons/fa'

export default function SubscriptionSelectModal({show, onClose, subscriptionSelect}){

    const [subscriptionLevel, setSubscriptionLevel] = useState("monthly");

    const handleCloseClick = () => {
        onClose();
    }

    const handleSelectClick = () => {
        subscriptionSelect(subscriptionLevel);
        onClose();
    }

    return (
        <>
        { show ? (
    
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all md:max-w-5xl sm:my-8 sm:max-w-lg sm:w-[50%]">
                        <h3 className="modal-header text-sm italic mb-2 leading-6 font-medium p-4" id="modal-title">select payment frequency</h3>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    
                                    <div className="mt-2 flex subscription-select justify-between">
                                        <button 
                                            onClick={(e) => setSubscriptionLevel("monthly")} 
                                            className={subscriptionLevel == "monthly" ? ("active"):""}
                                        >
                                            <FaCheckCircle />
                                            <h3 className="text-2xl">pay monthly</h3>
                                            <h4 className="text-l">${process.env.NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE}</h4>
                                            <p><small><em>billed automatically</em></small></p>
                                        </button>
                                        <button 
                                            onClick={(e) => setSubscriptionLevel("yearly")} 
                                            className={subscriptionLevel == "yearly" ? ("active"):""}
                                        >
                                            <FaCheckCircle />
                                            <h3 className="text-2xl">pay yearly</h3>
                                            <h4 className="text-l">${process.env.NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE}</h4>
                                            <p><small><em>billed automatically<br/>cancel within 10 days for a full refund</em></small></p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex flex justify-end">
                            <button type="button" onClick={handleCloseClick} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">cancel</button>
                            <button type="button" onClick={handleSelectClick} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-yellow-300 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">select</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null}
        </>
    )
}