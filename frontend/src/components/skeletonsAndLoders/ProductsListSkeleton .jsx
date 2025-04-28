import React from 'react';
import { motion } from 'framer-motion';

const ProductsListSkeleton = () => {
    // Number of skeleton items to show
    const skeletonItems = Array(5).fill(0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-slate-900 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto"
        >
            <h2 className="text-2xl font-bold text-center text-pink-500 mb-6">Products</h2>

            {/* Desktop Table Skeleton */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-white border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-left text-pink-400 text-sm uppercase">
                            <th className="p-3">Product</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">In Stock</th>
                            <th className="p-3">Featured</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skeletonItems.map((_, index) => (
                            <tr key={index} className="bg-slate-800 rounded-lg text-sm">
                                <td className="flex items-center gap-3 p-3 rounded-l-lg">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 animate-pulse" />
                                    <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
                                </td>
                                <td className="p-3">
                                    <div className="h-4 w-16 bg-slate-700 rounded animate-pulse" />
                                </td>
                                <td className="p-3">
                                    <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
                                </td>
                                <td className="p-3">
                                    <div className="h-4 w-12 bg-slate-700 rounded animate-pulse" />
                                </td>
                                <td className="p-3">
                                    <div className="h-5 w-5 bg-slate-700 rounded-full animate-pulse" />
                                </td>
                                <td className="p-3 rounded-r-lg">
                                    <div className="h-5 w-5 bg-slate-700 rounded animate-pulse" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card Skeleton */}
            <div className="md:hidden space-y-3">
                {skeletonItems.map((_, index) => (
                    <div key={index} className="bg-slate-800 rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-full bg-slate-700 animate-pulse" />
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse" />
                                    <div className="h-3 w-1/2 bg-slate-700 rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-5 w-5 bg-slate-700 rounded-full animate-pulse" />
                                <div className="h-5 w-5 bg-slate-700 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ProductsListSkeleton;