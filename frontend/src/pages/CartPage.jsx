import React, { useEffect, useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { motion } from "framer-motion"
import { Trash2, CrossIcon } from 'lucide-react';
import CartPageSkeleton from "../components/skeletonsAndLoders/CartPageSkeleton"
import PinkButtonSpinner from "../components/skeletonsAndLoders/PinkButtonSpinner"
import NoCartItemsFound from '../components/NoCartItemsFound';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import ButtonLoader from "../components/skeletonsAndLoders/ButtonLoader"

const loadScript = (url) => {
    return new Promise((resolve) => {
        if (document.querySelector(`script[src="${url}"]`)) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = url;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const CartPage = () => {
    const { cartItems, getCartProducts, removeAllFromCart, totalPrice, discountedPrice, discount, screenLoading, checkoutButtonLoading, updateQuantity, getAllCoupons, coupons, validateCoupon, couponApplied, removeCoupon, createOrder, verifyPayment } = useCartStore();
    const navigate = useNavigate();
    const [deletingItemId, setDeletingItemId] = useState(null);
    const [inputCode, setInputCode] = useState("")

    useEffect(() => {
        getCartProducts();
        getAllCoupons();
    }, []);

    useEffect(() => {
        (async () => {
            const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!scriptLoaded) {
                alert("Failed to load Razorpay SDK. Please check your internet connection.");
                return;
            }
        })()
    }, [])


    const handleDelete = async (productId) => {
        setDeletingItemId(productId);
        await removeAllFromCart(productId);
        setDeletingItemId(null);
    };

    const handleQuantityChange = async (productId, quantity) => {
        updateQuantity(productId, quantity)
    }

    const increaseByOne = (item) => {
        let quantity = Number(item.quantity) + 1;
        if (quantity > 20) {
            quantity = 20
            toast.error("Max quantity reached")
        }
        handleQuantityChange(item.productId, quantity)
    }

    const decreaseByOne = (item) => {
        const quantity = Math.max(0, Number(item.quantity) - 1)
        handleQuantityChange(item.productId, quantity)
    }

    const handleCouponApply = (code) => {
        validateCoupon(code)
    }

    const handleRemoveCoupon = () => {
        setInputCode("")
        removeCoupon()
    }

    const handleCheckout = async () => {
        try {
            const res = await createOrder();
            if (res.success) {
                const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
                const paymentOptions = {
                    "key": key,
                    "amount": res.order.amount,
                    "currency": res.order.currency,
                    "name": "STYLIK",
                    "order_id": res.order.id,
                    "handler": async (response) => {
                        const res = await verifyPayment(response)
                        if (res.success) {
                            navigate("/payment-success")
                        }
                    },
                    "prefill": {
                        "name": 'Stalin',
                        "email": 'stalin@example.com',
                        "contact": '6371352739'

                    },
                    "theme": {
                        "color": "#bb03bb"
                    }
                }
                const razorpayInstance = new Razorpay(paymentOptions);
                razorpayInstance.open();
            } else {
                navigate("/payment-failed");
            }
        } catch (error) {
            console.log("Error creating order:", error);
            toast.error("Failed to start checkout. Please try again.");
            navigate("/payment-failed");
        }

    }

    if (screenLoading) {
        return <CartPageSkeleton />
    }
    if (cartItems.length === 0) {
        return <NoCartItemsFound />
    }
    return (
        <div className="min-h-screen text-white px-6 py-4 w-[90%] mx-auto">
            <h2 className="text-4xl font-bold text-pink-500 mb-8 text-center">Your Cart</h2>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items - Left */}
                <div className="flex-1 space-y-6">
                    {cartItems.map((item) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            key={item.productId}
                            className="flex items-center bg-slate-800 rounded-2xl shadow-md p-4 sm:p-6 gap-6"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-32 h-28 object-cover rounded-xl cursor-pointer"
                            />

                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-semibold cursor-pointer">{item.name}</h3>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => decreaseByOne(item)} className="bg-pink-500 hover:bg-pink-600 pb-1.5 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md text-xl cursor-pointer">
                                            −
                                        </button>
                                        <input
                                            onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                                            type="text"
                                            inputMode='numeric'
                                            pattern='[0-9]*'
                                            className="text-lg font-medium w-12 text-center border-none outline-none bg-transparent"
                                            value={item.quantity}
                                        />
                                        <button onClick={() => increaseByOne(item)} className="bg-pink-500 hover:bg-pink-600 pb-1.5 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md text-xl cursor-pointer">
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4">
                                    <p className="text-pink-400 font-medium">Price: ₹ {item.price}</p>
                                    <p className="text-white font-semibold">Total: ₹ {item.price * item.quantity}</p>
                                </div>
                            </div>

                            {/* Clean Delete Button */}
                            <button
                                onClick={() => handleDelete(item.productId)}
                                className="ml-auto self-center text-pink-400 hover:text-red-500 hover:bg-slate-700 p-2 rounded-full transition-all cursor-pointer"
                                title="Remove Item"
                            >
                                {deletingItemId === item.productId ? (
                                    <PinkButtonSpinner />
                                ) : (
                                    <Trash2 size={20} />
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Right Panel - Summary & Coupon */}
                <div className="w-full lg:w-[350px] space-y-6">
                    {/* Coupon Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-slate-800 p-6 rounded-2xl shadow-md space-y-4">
                        <h4 className="text-xl font-semibold text-white">Have a Coupon?</h4>
                        <div className='relative'>
                            <input
                                type="text"
                                placeholder="Enter Code"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-slate-700 text-white outline-none"
                                disabled={couponApplied.isVerified}
                            />
                            {couponApplied.isVerified && (
                                <p className="text-green-400 text-xs mt-1 ml-1">Coupon applied </p>
                            )}

                            <button
                                onClick={handleRemoveCoupon}
                                className={`${couponApplied.isVerified ? "block" : "hidden"}`}
                            >
                                <CrossIcon className='absolute fill-red-600 rotate-45 top-2 right-2 font-light cursor-pointer hover:scale-104 active:scale-110 ' />
                            </button>

                        </div>

                        <button
                            onClick={() => handleCouponApply(inputCode)}
                            disabled={!inputCode || couponApplied.isVerified}
                            className={`cursor-pointer w-full   font-bold py-2 px-4 rounded-2xl transition-all ${couponApplied.code ? "cursor-default bg-pink-950 text-gray-400" : "text-white bg-pink-600 hover:bg-pink-700"}`}>
                            {couponApplied.isVerified ? "Applied" : "Apply Code"}
                        </button>

                        {/* Scrollable coupon list */}
                        <div className="text-sm text-pink-300">
                            <p className="mb-2">Available Coupons:</p>
                            <div className="max-h-[180px] overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                                {
                                    coupons.map((coupon) => {
                                        return (
                                            coupon.isActive &&
                                            <div key={coupon.code} className="flex justify-between items-start border border-dotted border-pink-400 p-3 rounded-xl">
                                                <div className="space-y-1">
                                                    <p className="text-white font-medium">{coupon.code}</p>
                                                    <p className="text-pink-300 text-sm">Expires: {coupon.expirationDate}</p>
                                                    <p className="text-green-400 text-sm">Discount: {coupon.discountPercentage}%</p>
                                                </div>
                                                <button
                                                    disabled={couponApplied.code === coupon.code}
                                                    onClick={() => {
                                                        setInputCode(coupon.code)
                                                        handleCouponApply(coupon.code)
                                                    }}
                                                    className={`"ml-4  border-1 border-dashed   text-white text-sm px-3 py-1.5 rounded-xl font-semibold  pb-2 ${couponApplied.code === coupon.code ? "cursor-not-allowed opacity-40" : " hover:bg-pink-700 cursor-pointer"}`}>
                                                    {couponApplied.code === coupon.code ? "Applied" : "Apply Code"}
                                                </button>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </motion.div>


                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-slate-800 p-6 rounded-2xl shadow-md space-y-4">
                        <h4 className="text-xl font-semibold text-white">Order Summary</h4>
                        <div className="flex justify-between text-pink-400">
                            <span>Original Price:</span>
                            <span>₹ {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 font-semibold text-sm">
                            <span>Coupon:</span>
                            <span>{(discount ? discount : totalPrice * couponApplied.discountPercentage * 0.01).toFixed(2) || 0}</span>
                        </div>
                        <div className="flex justify-between text-white font-bold text-lg">
                            <span>Total:</span>
                            <span>₹ {(couponApplied.isVerified ? discountedPrice : totalPrice).toFixed(2)}</span>
                        </div>
                        <button onClick={handleCheckout} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl transition-all flex items-center justify-center">
                            {checkoutButtonLoading ? <ButtonLoader /> : "Proceed to Checkout"}
                        </button>
                        <Link to={"/"}>
                            <p className="text-center text-sm text-pink-400 mt-2 cursor-pointer hover:underline">
                                Continue Shopping →
                            </p>
                        </Link>

                    </motion.div>
                </div>
            </div>
        </div>

    );
};

export default CartPage;
