import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonLoader from "../components/skeletonsAndLoders/ButtonLoader";
import ProductCardSkeleton from '../components/skeletonsAndLoders/ProductCardSkeleton';
import { useCartStore } from '../store/useCartStore';
import { useProductStore } from '../store/useProductStore';
import { useUserStore } from "../store/useUserStore";

const CategoryPage = () => {

    const { fetchProductByCategory, categoryProducts, screenLoading } = useProductStore();
    const { addToCart, cartItems, getCartProducts } = useCartStore();
    const { user } = useUserStore();
    const { category } = useParams();
    const navigate = useNavigate();
    const [loadingProducts, setLoadingProducts] = useState([]);


    // Fetch cart items on mount
    useEffect(() => {
        fetchProductByCategory(category);
        if (user) getCartProducts();
    }, [category]);

    const handleAddToCart = (productId) => {
        if (!user) {
            toast("Login to proceed with cart")
            navigate('/login');
            return;
        }
        if (cartItems.some(item => item.productId === productId)) {
            navigate("/cart")
            return;
        }
        // Start loading the button for the specific product
        setLoadingProducts((prev) => [...prev, productId]);

        addToCart(productId).finally(() => {
            // After adding to cart, remove loading for the specific product
            setLoadingProducts((prev) => prev.filter(id => id !== productId));
        });
    }


    return (
        <div className="min-h-screen w-full    bg-slate-950 text-white px-4  sm:px-10 md:px-20 lg:px-32 py-6 sm:py-9 md:py-12 lg:py-16 transition-all duration-200">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-pink-500 mb-4 sm:mb-6 md:mb-8 lg:mb-12 capitalize transition-all duration-200 ">
                {category} Collection
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-start justify-center">
                {screenLoading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))
                    : categoryProducts.length === 0 ? (
                        <div className="col-span-full flex items-center justify-center min-h-[50vh]">
                            <div className="text-gray-400 text-2xl px-6 py-4 rounded-xl font-bold text-center">
                                No Products Found
                            </div>
                        </div>
                    ) :
                        categoryProducts.map((product) => {
                            const buttonLabel = cartItems.some(item => item.productId === product._id)
                                ? "Go to Cart"
                                : "Add to Cart";
                            return (
                                <div
                                    key={product._id}
                                    className="bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 relative cursor-pointer"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-44 sm:h-52 md:h-60  object-cover"
                                    />
                                    <div className="p-2 md:p-4 space-y-1 md:space-y-2">
                                        <h3 className="text-sm sm:text-base md:text-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                                            {product.name}
                                        </h3>
                                        <p className="text-pink-400 font-bold text-sm sm:text-base md:text-lg lg:text-xl">₹ {product.price}</p>
                                        <button
                                            onClick={() => handleAddToCart(product._id)}
                                            className="mt-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-1 px-2 md:py-2 md:px-4 rounded-xl transition duration-300 flex items-center justify-center"
                                        >
                                            {loadingProducts.includes(product._id) ? <ButtonLoader /> : buttonLabel}
                                        </button>
                                    </div>
                                    {product.isFeatured && (
                                        <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-1 md:px-3 py-1 rounded-full">
                                            Featured
                                        </span>
                                    )}
                                </div>
                            );
                        })}
            </div>
        </div>

    );
};

export default CategoryPage;

