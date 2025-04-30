import React from 'react';

const CartPageSkeleton = () => {
    return (
        <div className="min-h-screen px-2 py-4 md:w-[90%] w-full mx-auto animate-pulse">
            {/* Heading Skeleton */}
            <div className="h-8 md:h-12 w-1/4 mx-auto bg-slate-700 rounded-xl mb-4 md:mb-8"></div>

            <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
                {/* Left Side - Cart Items Skeleton */}
                <div className="flex-1 space-y-2 md:space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex bg-slate-800 rounded-xl md:rounded-2xl shadow-md p-2 md:p-4 gap-2">
                            {/* Image Placeholder */}
                            <div className="w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32 bg-slate-700 rounded-xl"></div>

                            {/* Middle Content */}
                            <div className="flex-1 pl-2 pb-2 space-y-3">
                                <div className="h-5 w-3/4 bg-slate-700 rounded"></div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-700 rounded-full"></div>
                                    <div className="w-8 h-6 bg-slate-700 rounded"></div>
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-700 rounded-full"></div>
                                </div>
                                <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
                            </div>

                            {/* Right Side (Delete + Total) */}
                            <div className="flex flex-col items-center justify-between pb-2 space-y-4">
                                <div className="w-5 h-5 bg-slate-700 rounded-full"></div>
                                <div className="h-4 w-16 bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Side - Summary & Coupon Skeleton */}
                <div className="w-full lg:w-[350px] space-y-2 md:space-y-4 lg:space-y-6">
                    {/* Coupon Panel Skeleton */}
                    <div className="bg-slate-800 p-4 md:p-6 rounded-2xl shadow-md space-y-4">
                        <div className="h-6 w-1/2 bg-slate-700 rounded"></div>
                        <div className="flex lg:flex-col gap-2">
                            <div className="flex-1 lg:w-full h-10 bg-slate-700 rounded-xl"></div>
                            <div className="w-24 lg:w-full h-10 bg-slate-700 rounded-xl"></div>
                        </div>
                        <div className="h-4 w-1/3 bg-slate-700 rounded"></div>

                        {/* Coupon List Skeleton */}
                        <div className="space-y-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="p-3 border border-dashed border-slate-600 rounded-xl">
                                    <div className="h-4 w-1/2 bg-slate-700 rounded mb-2"></div>
                                    <div className="h-3 w-3/4 bg-slate-700 rounded mb-1"></div>
                                    <div className="h-3 w-1/3 bg-slate-700 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary Skeleton */}
                    <div className="bg-slate-800 p-4 md:p-6 rounded-xl shadow-md space-y-4">
                        <div className="h-6 w-1/3 bg-slate-700 rounded"></div>
                        <div className="flex justify-between">
                            <div className="h-4 w-1/2 bg-slate-700 rounded"></div>
                            <div className="h-4 w-1/4 bg-slate-700 rounded"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
                            <div className="h-4 w-1/4 bg-slate-700 rounded"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className="h-5 w-1/4 bg-slate-700 rounded"></div>
                            <div className="h-5 w-1/4 bg-slate-700 rounded"></div>
                        </div>
                        <div className="w-full h-12 bg-slate-700 rounded-2xl mt-4"></div>
                        <div className="h-4 w-1/2 mx-auto bg-slate-700 rounded mt-2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPageSkeleton;