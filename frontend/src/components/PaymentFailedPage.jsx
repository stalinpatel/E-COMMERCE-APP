import { Link, useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
export default function PaymentFailedPage() {
    const navigate = useNavigate();
    const { orderDetails: { orderId }, discountedPrice } = useCartStore();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-6 py-12">
            <XCircle className="text-red-500" size={80} />
            <h1 className="text-4xl font-bold mt-6 text-red-400">Payment Failed</h1>
            <p className="mt-4 text-center text-gray-400 max-w-md">
                Oops! Something went wrong while processing your payment. Don't worry — it happens to the best of us.
                Your order is still safe. Try again or come back later.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                    onClick={() => navigate("/cart")}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-2xl transition-all"
                >
                    Try Again
                </button>
                <Link to="/" className="flex items-center justify-center bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-6 rounded-2xl transition-all">
                    Back to Home
                </Link>
            </div>

            {/* Hardcoded Payment Info */}
            <div className="bg-slate-800 p-6 mt-10 rounded-2xl shadow-lg w-full max-w-md space-y-4">
                <h2 className="text-xl font-semibold text-center text-pink-400">Payment Details</h2>
                <div className="flex justify-between text-gray-400">
                    <span>Order ID:</span>
                    <span>{orderId}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                    <span>Amount:</span>
                    <span>₹{discountedPrice || 0}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                    <span>Status:</span>
                    <span className="text-red-500 font-semibold">Failed</span>
                </div>
            </div>
        </div>
    );
}
