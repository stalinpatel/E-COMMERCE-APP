import React from 'react';

const CouponTableSkeleton = () => {
    // Number of skeleton items to show
    const skeletonItems = Array(5).fill(0);

    return (
        <div className="bg-slate-900 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto animate-pulse">
            {/* Title Skeleton */}
            <div className="text-center mb-6">
                <div className="h-8 w-48 bg-slate-700 rounded mx-auto" />
            </div>

            {/* Add Button Skeleton */}
            <div className="flex justify-center md:justify-end mb-4">
                <div className="h-10 w-36 bg-slate-700 rounded-lg" />
            </div>

            {/* Desktop Table Skeleton */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-left text-sm uppercase text-pink-400">
                            {['Coupon Code', 'Discount %', 'Expiration Date', 'Status', 'Actions'].map((_, i) => (
                                <th key={i} className="p-3">
                                    <div className="h-4 w-24 bg-slate-700 rounded" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {skeletonItems.map((_, rowIndex) => (
                            <tr key={rowIndex} className="bg-slate-800 rounded-lg">
                                <td className="p-3">
                                    <div className="h-4 w-32 bg-slate-700 rounded" />
                                </td>
                                <td className="p-3">
                                    <div className="h-4 w-16 bg-slate-700 rounded" />
                                </td>
                                <td className="p-3">
                                    <div className="h-4 w-24 bg-slate-700 rounded" />
                                </td>
                                <td className="p-3">
                                    <div className="h-6 w-6 bg-slate-700 rounded-full mx-auto" />
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-4 justify-center">
                                        <div className="h-5 w-5 bg-slate-700 rounded" />
                                        <div className="h-5 w-5 bg-slate-700 rounded" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card Skeleton */}
            <div className="md:hidden space-y-3">
                {skeletonItems.map((_, index) => (
                    <div key={index} className="bg-slate-800 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="h-8 w-8 bg-slate-700 rounded-full" />
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="h-4 w-3/4 bg-slate-700 rounded" />
                                    <div className="h-3 w-1/2 bg-slate-700 rounded" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-5 bg-slate-700 rounded-full" />
                                <div className="h-5 w-5 bg-slate-700 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CouponTableSkeleton;