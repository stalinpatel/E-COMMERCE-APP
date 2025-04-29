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
        <div className="min-h-screen text-white px-2 py-4 md:w-[90%] w-full mx-auto">
            <h2 className="text-xl md:text-4xl font-bold text-pink-500 mb-4 mt-2 md:mb-8 text-center ">Your Cart</h2>
            <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
                {/* Cart Items - Left */}
                <div className="flex-1 space-y-2 md:space-y-6">
                    {cartItems.map((item) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            key={item.productId}
                            className="flex  bg-slate-800 rounded-xl md:rounded-2xl shadow-md p-2 md:p-4 gap-2"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32 object-cover rounded-xl cursor-pointer transitional duration-200 ease-in-out"
                            />

                            <div className="flex flex-1 justify-between flex-col pl-2 pb-2">
                                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold cursor-pointer">{item.name}</h3>
                                <div className="flex items-center   md:space-x-2 ">
                                    <button onClick={() => decreaseByOne(item)} className=" bg-pink-500 hover:bg-pink-600 pb-1 md:pb-1.5 text-white w-4 h-4 md:w-8 md:h-8 flex items-center justify-center rounded-full shadow-md text-xl cursor-pointer">
                                        <span className='text-xl md:text-4xl'>-</span>
                                    </button>
                                    <input
                                        onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                                        type="text"
                                        inputMode='numeric'
                                        pattern='[0-9]*'
                                        className=" text-xs md:text-lg font-medium w-6 md:w-12 text-center border-none outline-none bg-transparent"
                                        value={item.quantity}
                                    />
                                    <button onClick={() => increaseByOne(item)} className="bg-pink-500 hover:bg-pink-600 pb-1 md:pb-1.5 text-white w-4 h-4 md:w-8 md:h-8 flex items-center justify-center rounded-full shadow-md text-xl cursor-pointer">
                                        <span className='text-lg md:text-4xl'>+</span>
                                    </button>
                                </div>
                                <p className="text-pink-400 font-medium text-xs sm:text-sm md:text-xl">
                                    <span className='hidden sm:inline-block'>Price:&nbsp;</span>
                                    ₹{item.price}</p>
                            </div>
                            <div className="flex flex-col  items-center justify-between pb-2">
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
                                <p className="text-white font-semibold text-xs sm:text-sm md:text-xl">Total: ₹ {item.price * item.quantity}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Right Panel - Summary & Coupon */}
                <div className="w-full lg:w-[350px] space-y-2 md:space-y-4 lg:space-y-6">
                    {/* Coupon Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-slate-800 p-4 md:p-6 rounded-2xl shadow-md space-y-4">
                        <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white">Have a Coupon?</h4>
                        <div className='flex lg:flex-col w-full items-center lg:gap-y-2 gap-x-2 lg:gap-x-0'>
                            <div className='relative flex-1 lg:w-full'>
                                <input
                                    type="text"
                                    placeholder="Enter Code"
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value)}
                                    className="w-full px-4 py-2  rounded-xl bg-slate-700 text-sm lg:text-base text-white outline-none"
                                    disabled={couponApplied.isVerified}
                                />

                                <button
                                    onClick={handleRemoveCoupon}
                                    className={`${couponApplied.isVerified ? "block" : "hidden"}`}
                                >
                                    <CrossIcon className='absolute scale-80 sm:scale-90 md:scale-100 fill-red-600 rotate-45 top-2 right-2 font-light cursor-pointer hover:scale-104 active:scale-110 ' />
                                </button>

                            </div>
                            <button
                                onClick={() => handleCouponApply(inputCode)}
                                disabled={!inputCode || couponApplied.isVerified}
                                className={`cursor-pointer  lg:w-full   font-bold py-2 px-4 rounded-xl text-sm sm:text-lg md:text-base  whitespace-nowrap transition-all ${couponApplied.code ? "cursor-default bg-pink-950 text-gray-400" : "text-white bg-pink-600 hover:bg-pink-700"}`}>
                                {couponApplied.isVerified ? "Applied" : "Apply Code"}
                            </button>
                        </div>
                        {couponApplied.isVerified && (
                            <p className="text-green-400 text-xs  ml-1">Coupon applied </p>
                        )}


                        {/* Scrollable coupon list */}
                        <div className="text-sm text-pink-300">
                            <p className="mb-2 ">Available Coupons:</p>
                            <div className="max-h-[180px] overflow-y-auto space-y-4  scrollbar-hide">
                                {
                                    coupons.map((coupon) => {
                                        return (
                                            coupon.isActive &&
                                            <div key={coupon.code} className="flex justify-between items-start border border-dotted border-pink-400 p-3 rounded-xl">
                                                <div className="space-y-1">
                                                    <p className="text-white font-medium text-sm sm:text-base ">{coupon.code}</p>
                                                    <p className="text-pink-300 text-xs sm:text-sm">Expires: {coupon.expirationDate}</p>
                                                    <p className="text-green-400 text-xs sm:text-sm">Discount: {coupon.discountPercentage}%</p>
                                                </div>
                                                <button
                                                    disabled={couponApplied.code === coupon.code}
                                                    onClick={() => {
                                                        setInputCode(coupon.code)
                                                        handleCouponApply(coupon.code)
                                                    }}
                                                    className={`"ml-4  border-1 border-dashed   text-white text-xs sm:text-sm px-3 py-1.5 rounded-xl font-semibold  pb-2 ${couponApplied.code === coupon.code ? "cursor-not-allowed opacity-40" : " hover:bg-pink-700 cursor-pointer"}`}>
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
                        className="bg-slate-800 p-4 md:p-6 rounded-xl shadow-md space-y-4 transition-all duration-200 ease-in-out">
                        <h4 className="text-lg md:text-xl font-semibold text-white">Order Summary</h4>
                        <div className="flex justify-between text-pink-400 text-sm sm:text-base">
                            <span>Original Price:</span>
                            <span>₹ {totalPrice.toFixed(2)}</span>
                        </div>
                        {
                            couponApplied.isVerified &&
                            <div className="flex justify-between text-gray-400 font-semibold text-xs sm:text-sm md:text-base">
                                <span>Coupon:</span>
                                <span>{(discount ? discount : totalPrice * couponApplied.discountPercentage * 0.01).toFixed(2) || 0}</span>
                            </div>
                        }
                        <div className="flex justify-between text-white font-bold text-base sm:text-lg md:text-xl">
                            <span>Total:</span>
                            <span>₹ {(couponApplied.isVerified ? discountedPrice : totalPrice).toFixed(2)}</span>
                        </div>
                        <button onClick={handleCheckout} className="w-full mt-4 text-xs sm:text-sm md:text-base bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl transition-all flex items-center justify-center">
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
