import React, { useEffect } from 'react';
import { useUserStore } from "../store/useUserStore";
import LoadingSpinner from '../components/skeletonsAndLoders/LoadingSpinner';
import PinkButtonSpinner from "../components/skeletonsAndLoders/PinkButtonSpinner"

const OrdersPage = () => {
    const { getAllOrders, orders, loadingOrders } = useUserStore();

    useEffect(() => {
        getAllOrders();
    }, [getAllOrders]);

    // Helper function to format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper function for payment status styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'successful':
                return 'bg-green-600 text-green-100';
            case 'failed':
                return 'bg-red-600 text-red-100';
            case 'pending':
                return 'bg-yellow-600 text-yellow-100';
            default:
                return 'bg-gray-600 text-gray-100';
        }
    };


    // Calculate original price
    const originalPrice = (order) => {
        return order.items.reduce((itemAcc, item) => {
            return itemAcc + (item.price * item.quantity);
        }, 0);
    };

    if (loadingOrders) {
        return (
            <>
                <div className='min-h-screen scale-150 w-full flex items-center justify-center'>
                    <PinkButtonSpinner />
                </div>
            </>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <h3 className="text-2xl text-center text-gray-400 font-bold">No orders yet</h3>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 ">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-xl sm:text-2xl font-bold px-2 py-3 mb-2 sm:mb-8">Your Orders</h1>
                <div className="space-y-4 sm:space-y-6">
                    {orders.map((order) => {
                        const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                        return (
                            <div key={order.razorpayPaymentId} className="bg-slate-800 rounded-lg p-4 sm:p-6 shadow-lg">
                                {/* Order header - responsive layout */}
                                <div className="flex flex-col sm:flex-row justify-between gap-2 md:gap-4 sm:items-center mb-4 pb-4 border-b border-slate-400">
                                    <div className='flex flex-row md:flex-col items-center  '>
                                        <p className="text-xs sm:text-sm  ">Order Placed: </p>
                                        <p className="text-xs sm:text-base ">&nbsp;{formatDate(order.createdAt)}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                        <div className='flex flex-row md:flex-col items-center '>
                                            <p className="text-xs sm:text-sm text-slate-400">Payment Status:</p>
                                            <span className={`${getStatusStyle(order.paymentStatus)} hidden md:inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm`}>
                                                {order.paymentStatus}
                                            </span>
                                            <span className={`${getStatusStyle(order.paymentStatus)} scale-90 md:scale-0  inline md:hidden px-2 sm:px-3 py-1 rounded-full text-xs sm:text-base`}>
                                                &nbsp;{order.paymentStatus}
                                            </span>
                                        </div>
                                        <div className='flex flex-row md:flex-col items-center md:items-end'>
                                            <p className="text-xs sm:text-sm text-slate-400">Order ID:</p>
                                            <p className="font-mono text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                                                &nbsp; {order._id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order items - responsive layout */}
                                <div className="space-y-4  sm:space-y-6 mb-4 sm:mb-6">
                                    {order.items.map((item) => (
                                        <div key={`${order.razorpayPaymentId}-${item._id || item.name}`} className="flex gap-3 sm:gap-4 border-b border-slate-700 pb-2">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12  sm:w-20 sm:h-20 md:w-28 md:h-28 object-cover rounded-md md:rounded-lg"
                                            />
                                            <div className="flex-1 ">
                                                <h3 className="font-semibold text-sm sm:text-base  md:text-lg lg:text-xl mb-1 line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <div className=" scale-90 sm:scale-100 flex justify-between text-xs sm:text-sm lg:text-base">
                                                    <div>
                                                        <p className="text-slate-500 ">Price</p>
                                                        <p>₹{item.price.toFixed(2)}</p>
                                                    </div>
                                                    <div className='flex flex-col  items-center'>
                                                        <p className="text-slate-500 hidden sm:block">Quantity</p>
                                                        <p className="text-slate-500 sm:hidden">Qty:</p>
                                                        <p>&nbsp;{item.quantity}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <p className="text-slate-500">Total</p>
                                                        <p>₹{(item.quantity * item.price).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Payment summary */}
                                <div className="bg-slate-900 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 transition-all duration-200 ease-in-out[">
                                    <div className="space-y-2">
                                        <div className="flex justify-between  md:font-bold text-xs sm:text-base md:text-md lg:text-lg">
                                            <span>Original Price</span>
                                            <span>₹{originalPrice(order).toFixed(2)}</span>
                                        </div>
                                        {order.coupon && (
                                            <div className="flex justify-between text-xs sm:text-sm ">
                                                <span className="text-slate-400 flex items-center  justify-center">
                                                    <div className='md:text-base'>Coupon:&nbsp;</div>
                                                    <div className='scale-80 sm:scale-100  font-semibold'>{order.coupon.code} (-{order.coupon.discountPercentage}%)</div>
                                                </span>
                                                <span className='scale-90 sm:scale-100 md:text-base text-slate-400'>-₹{(subtotal * order.coupon.discountPercentage / 100).toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold text-xs sm:text-base  md:text-lg lg:text-xl pt-2">
                                            <span>Total Amount</span>
                                            <span>₹{order.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment details - responsive layout */}
                                <div className="pt-3 sm:pt-4 border-t border-slate-700">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1  sm:gap-4 text-xs sm:text-sm md:text-lg ">
                                        <div className='flex items-center '>
                                            <p className="text-slate-400">Payment ID:</p>
                                            <p className="font-mono break-all">&nbsp;{order.razorpayPaymentId}</p>
                                        </div>
                                        <div className='flex items-center '>
                                            <p className="text-slate-400">Transaction Date:</p>
                                            <p>&nbsp;{formatDate(order.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div >
    );
};

export default OrdersPage;