import React, { useState, useEffect } from 'react';
import { Trash2, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProductStore } from '../store/useProductStore';
import PinkButtonSpinner from './skeletonsAndLoders/PinkButtonSpinner';
const ProductsList = () => {
  const { allProducts, toggleFeaturedProduct, deleteProduct, loading, } = useProductStore();
  const [expandedProduct, setExpandedProduct] = useState(null);

  const handleFeatureClick = (id) => {
    toggleFeaturedProduct(id);
  };

  const handleDeleteClick = (id) => {
    deleteProduct(id);
  };

  const toggleExpand = (id) => {
    setExpandedProduct(expandedProduct === id ? null : id);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-slate-900 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-center text-pink-500 mb-6">Products</h2>

      {/* Desktop Table View */}
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
            {allProducts.map(product => (
              <tr key={product._id} className="bg-slate-800 rounded-lg text-sm">
                <td className="flex items-center gap-3 p-3 rounded-l-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-full border border-pink-400"
                  />
                  <span>{product.name}</span>
                </td>
                <td className="p-3">{product.price} ₹</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleFeatureClick(product._id)}
                    className="hover:scale-105 active:scale-110 transition duration-200"
                  >
                    {product.isFeatured ? (
                      <Star className="text-yellow-400 fill-yellow-400" />
                    ) : (
                      <Star className="text-yellow-400" />
                    )}
                  </button>
                </td>
                <td className="p-3 rounded-r-lg">
                  <button
                    onClick={() => handleDeleteClick(product._id)}
                    className="hover:text-red-600 transition hover:scale-105 active:scale-110 duration-100"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {allProducts.map(product => (
          <div
            key={product._id}
            className="bg-slate-800 rounded-lg p-3 text-sm relative"
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(product._id)}
            >
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-full border border-pink-400"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-xs text-slate-400">In Stock: {product.stock}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeatureClick(product._id);
                  }}
                  className="hover:scale-105 active:scale-110 transition duration-200"
                >
                  {product.isFeatured ? (
                    <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  ) : (
                    <Star className="text-yellow-400" size={18} />
                  )}
                </button>
                {expandedProduct === product._id ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedProduct === product._id && (
              <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Price:</span>
                  <span>{product.price} ₹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleDeleteClick(product._id)}
                    className="text-red-500 hover:text-red-600 transition flex items-center gap-1 justify-center"
                  >{
                      loading ? <PinkButtonSpinner /> : <Trash2 size={16} />
                    }
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductsList;