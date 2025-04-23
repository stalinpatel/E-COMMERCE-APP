import React from 'react';

const ProductCardSkeleton = () => {
    return (
        <div className="bg-slate-800 rounded-xl overflow-hidden shadow-md animate-pulse relative">
            {/* Image Placeholder */}
            <div className="w-full h-72 bg-slate-700" />

            {/* Text Placeholder */}
            <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-600 rounded w-3/4" />
                <div className="h-4 bg-slate-600 rounded w-1/2" />
            </div>

            {/* Featured Badge Placeholder */}
            <span className="absolute top-2 right-2 bg-slate-600 text-white text-xs px-3 py-1 rounded-full">
                &nbsp;
            </span>
        </div>
    );
};

export default ProductCardSkeleton;
