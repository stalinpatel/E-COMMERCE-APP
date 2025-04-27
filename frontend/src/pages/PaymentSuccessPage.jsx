import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from '../store/useCartStore';
import { formatDateTime } from "../utils/formatDateTime"
import { useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
    const navigate = useNavigate();

    const { paymentDetails: { orderId, paidAt, receiptId, status, amount } } = useCartStore();

    useEffect(() => {
        if (!orderId) {
            navigate("/")
        }
    }, [])
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-6 text-white">
            {/* Confetti Boom 🎉 */}

            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircle2 className="text-green-400" width={64} height={64} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    Payment Successful 🎉
                </h2>
                <p className="text-gray-300 mb-6">
                    Thank you for your purchase! Your payment has been confirmed.
                </p>

                <div className="text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-400">Order ID:</span>
                        <span>{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-400">Receipt ID:</span>
                        <span>{receiptId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-400">Amount Paid:</span>
                        <span>
                            ₹{amount}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-400">Status:</span>
                        <span className="text-green-400 font-medium">
                            {status}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-400">Payment Time:</span>
                        <span>{formatDateTime(paidAt)}</span>
                    </div>
                </div>

                <button className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all">
                    Go to Orders
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
