import React from 'react';

const CouponTableSkeleton = () => {
    return (
        <div className="bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto animate-pulse">
            <div className="text-2xl font-bold text-center text-pink-500 mb-6">
                <div className="h-8 w-48 bg-slate-700 rounded mx-auto" />
            </div>

            <div className="flex justify-end mb-4">
                <div className="h-10 w-36 bg-slate-700 rounded-lg" />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-left text-sm uppercase text-pink-400">
                            {['Coupon Code', 'Discount %', 'Expiration Date', 'Status', 'Actions'].map((_, i) => (
                                <th key={i}>
                                    <div className="h-4 w-24 bg-slate-700 rounded" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, rowIndex) => (
                            <tr key={rowIndex} className="bg-slate-800 rounded-lg">
                                {Array.from({ length: 5 }).map((_, colIndex) => (
                                    <td key={colIndex} className="p-3">
                                        <div className="h-4 w-full bg-slate-700 rounded" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CouponTableSkeleton;
