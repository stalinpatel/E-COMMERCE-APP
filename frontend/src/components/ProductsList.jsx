import React, { useEffect } from 'react';
import { Trash2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProductStore } from '../store/useProductStore';
import LoadingSpinner from "../components/LoadingSpinner";

const ProductsList = () => {

  // 🔁 Updated from `products` to `allProducts`
  const { screenLoading, allProducts, toggleFeaturedProduct, deleteProduct } = useProductStore();

  const handleFeatureClick = (id) => {
    toggleFeaturedProduct(id);
  };

  const handleDeleteClick = (id) => {
    deleteProduct(id);
  };

  if (screenLoading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-center text-pink-500 mb-6">Products</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-white border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-pink-400 text-sm uppercase">
              <th>Product</th>
              <th>Price</th>
              <th>Category</th>
              <th>In Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map(product => (
              <tr key={product._id} className="bg-slate-800 rounded-lg text-sm">
                <td className="flex items-center gap-3 p-3 rounded-l-lg cursor-pointer">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-full border border-pink-400 cursor-pointer"
                  />
                  {product.name}
                </td>
                <td>{product.price} ₹</td>
                <td>{product.category}</td>
                <td className="pl-5">{product.stock}</td>
                <td className="pl-5">
                  <button onClick={() => handleFeatureClick(product._id)} className="hover:scale-103 active:scale-110 transition duration-200">
                    {product.isFeatured ? (
                      <Star className="text-yellow-400 fill-yellow-400 inline cursor-pointer" />
                    ) : (
                      <Star className="text-yellow-400 inline cursor-pointer" />
                    )}
                  </button>
                </td>
                <td className="pl-4 rounded-r-lg">
                  <button
                    onClick={() => handleDeleteClick(product._id)}
                    className="hover:text-red-600 transition cursor-pointer hover:scale-103 active:scale-110 duration-100"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProductsList;
