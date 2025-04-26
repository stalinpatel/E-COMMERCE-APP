import React from 'react';
import { motion } from "framer-motion"

const CartPageSkeleton = () => {
    return (
        <div className="min-h-screen text-white px-6 py-4 w-[90%] mx-auto">
            <div className="h-12 w-64 mx-auto mb-8 bg-slate-700 rounded-xl animate-pulse"></div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left side - Cart items skeleton */}
                <div className="flex-1 space-y-6">
                    {[1, 2, 3].map((item) => (
                        <motion.div
                            key={item}
                            className="flex items-center bg-slate-800 rounded-2xl shadow-md p-4 sm:p-6 gap-6"
                        >
                            <div className="w-32 h-28 bg-slate-700 rounded-xl animate-pulse"></div>

                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="h-6 w-3/4 bg-slate-700 rounded animate-pulse"></div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse"></div>
                                        <div className="w-12 h-8 bg-slate-700 rounded animate-pulse"></div>
                                        <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse"></div>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4">
                                    <div className="h-5 w-24 bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-5 w-24 bg-slate-700 rounded animate-pulse"></div>
                                </div>
                            </div>

                            <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Right side - Summary skeleton */}
                <div className="w-full lg:w-[350px] space-y-6">
                    {/* Coupon panel skeleton */}
                    <motion.div className="bg-slate-800 p-6 rounded-2xl shadow-md space-y-4">
                        <div className="h-6 w-3/4 bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-10 w-full bg-slate-700 rounded-xl animate-pulse"></div>
                        <div className="h-10 w-full bg-slate-700 rounded-2xl animate-pulse"></div>

                        <div className="space-y-2">
                            <div className="h-4 w-1/2 bg-slate-700 rounded animate-pulse"></div>
                            {[1, 2].map((item) => (
                                <div key={item} className="p-3 rounded-xl border border-slate-700 space-y-2">
                                    <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-3 w-1/2 bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-3 w-1/3 bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-8 w-24 ml-auto bg-slate-700 rounded-xl animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Order summary skeleton */}
                    <motion.div className="bg-slate-800 p-6 rounded-2xl shadow-md space-y-4">
                        <div className="h-6 w-3/4 bg-slate-700 rounded animate-pulse"></div>
                        <div className="flex justify-between">
                            <div className="h-4 w-1/3 bg-slate-700 rounded animate-pulse"></div>
                            <div className="h-4 w-16 bg-slate-700 rounded animate-pulse"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className="h-4 w-1/4 bg-slate-700 rounded animate-pulse"></div>
                            <div className="h-4 w-12 bg-slate-700 rounded animate-pulse"></div>
                        </div>
                        <div className="flex justify-between pt-2">
                            <div className="h-5 w-1/5 bg-slate-700 rounded animate-pulse"></div>
                            <div className="h-5 w-20 bg-slate-700 rounded animate-pulse"></div>
                        </div>
                        <div className="h-12 w-full mt-4 bg-slate-700 rounded-2xl animate-pulse"></div>
                        <div className="h-4 w-1/2 mx-auto bg-slate-700 rounded animate-pulse"></div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CartPageSkeleton;