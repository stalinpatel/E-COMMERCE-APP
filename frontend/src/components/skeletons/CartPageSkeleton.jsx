import React from 'react';

const CartPageSkeleton = () => {
    return (
        <div className="min-h-screen text-white px-6 py-4 w-[80%] mx-auto animate-pulse">
            <h2 className="text-4xl font-bold text-pink-500 mb-8 text-center">Your Cart</h2>

            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center bg-slate-800 rounded-2xl shadow-md p-4 sm:p-6 gap-6">
                        <div className="w-32 h-28 bg-slate-700 rounded-xl" />
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="w-1/2 h-6 bg-slate-700 rounded" />
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-slate-700 rounded-full" />
                                    <div className="w-6 h-6 bg-slate-700 rounded" />
                                    <div className="w-8 h-8 bg-slate-700 rounded-full" />
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="w-1/3 h-4 bg-slate-700 rounded" />
                                <div className="w-1/4 h-4 bg-slate-700 rounded" />
                            </div>
                        </div>
                        <div className="w-8 h-8 bg-slate-700 rounded-full" />
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-slate-800 p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="w-24 h-6 bg-slate-700 rounded" />
                <div className="w-32 h-8 bg-slate-700 rounded" />
            </div>

            <div className="mt-8 flex justify-center">
                <div className="w-64 h-12 bg-slate-700 rounded-2xl" />
            </div>
        </div>
    );
};

export default CartPageSkeleton;