import React, { useEffect, useState } from 'react';
import { useUserStore } from "../store/useUserStore"
import LoadingSpinner from '../components/skeletonsAndLoders/LoadingSpinner';

const OrdersPage = () => {
    const { getAllOrders, orders, loadingOrderss } = useUserStore();

    useEffect(() => {
        getAllOrders();
    }, [])


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
        const total = order.items.reduce((itemAcc, item) => {
            return itemAcc + (item.price * item.quantity);
        }, 0);
        return total;
    };

    if (loadingOrderss) {
        return <LoadingSpinner />
    }

    if (!loadingOrderss && orders.length === 0) {
        return (
            <>
                <h3 className="text-2xl text-center text-gray-400 py-10 font-bold mb-8">No orders yet</h3>
            </>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Your Orders</h1>

                {orders.map((order) => {
                    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    return (
                        <div key={order._id} className="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
                            {/* Order header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-slate-700 pb-4">
                                <div className="mb-2 sm:mb-0">
                                    <p className="text-sm text-slate-400">Order Placed</p>
                                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-sm text-slate-400 py-2">Payment Status</p>
                                        <span className={`${getStatusStyle(order.paymentStatus)} px-3 py-1 rounded-full text-sm pb-1.5`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 py-2">Order ID</p>
                                        <p className="font-mono text-sm">{order._id}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order items */}
                            <div className="space-y-6 mb-6">
                                {order.items.map((item) => (
                                    <div key={item.name} className="flex items-start gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-1">{item.name}</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-slate-400">Quantity</p>
                                                    <p>{item.quantity}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400">Price</p>
                                                    <p>₹{item.price.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400">Total</p>
                                                    <p>₹{(item.quantity * item.price).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Payment summary */}
                            <div className="bg-slate-900 rounded-lg p-4">
                                <div className="max-w-xs ml-auto space-y-2">
                                    <div className="flex justify-between font-bold">
                                        <span>Original Price </span>
                                        <span>₹{originalPrice(order).toFixed(2)}</span>
                                    </div>
                                    {order.coupon && (
                                        <div className="flex justify-between">

                                            <span className="text-slate-400">Coupon : {order.coupon.code}  (-{order.coupon.discountPercentage}%)</span>
                                            <span>-₹{(subtotal * order.coupon.discountPercentage / 100).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold">
                                        <span>Total Amount</span>
                                        <span>₹{order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment details */}
                            <div className="mt-6 pt-4 border-t border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-400">Payment ID</p>
                                        <p className="font-mono">{order.razorpayPaymentId}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Transaction Date</p>
                                        <p>{formatDate(order.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
};

export default OrdersPage;