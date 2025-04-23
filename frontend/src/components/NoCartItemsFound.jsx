import { Link } from "react-router-dom"
import { ShoppingBag } from "lucide-react"
import React from 'react';

const NoCartItemsFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center text-white px-4">
            <div className="bg-slate-800 p-10 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-md w-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 text-pink-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.5H19m-12 0a1 1 0 110 2 1 1 0 010-2zm10 0a1 1 0 110 2 1 1 0 010-2z"
                    />
                </svg>

                <h2 className="text-2xl font-semibold text-pink-500">Your cart is empty</h2>
                <p className="text-slate-300 text-sm">
                    Looks like you haven’t added anything yet. Let’s fix that!
                </p>

                <Link
                    to="/"
                    className="bg-pink-600 hover:bg-pink-700 active:bg-pink-900 flex gap-x-2 items-center text-white font-bold py-3 px-6 rounded-2xl text-lg shadow-md transition-all"
                >
                    Shop Now
                    <ShoppingBag />
                </Link>
            </div>
        </div>
    );
};

export default NoCartItemsFound;