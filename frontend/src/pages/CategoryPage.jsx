import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from "../store/useUserStore"
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ButtonLoader from "../components/ButtonLoader"

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
        <div className="min-h-screen w-full bg-slate-950 text-white px-10 py-16">
            <h2 className="text-4xl font-bold text-center text-pink-500 mb-12 capitalize">
                {category} Collection
            </h2>
            {

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {screenLoading
                        ? Array.from({ length: 8 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))
                        :
                        categoryProducts.length === 0 ? (
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
                                            className="w-full h-72 object-cover"
                                        />
                                        <div className="p-4 space-y-2">
                                            <h3 className="text-xl font-semibold whitespace-nowrap overflow-ellipsis">{product.name}</h3>
                                            <p className="text-pink-400 font-bold">₹ {product.price}</p>
                                            <button
                                                onClick={() => { handleAddToCart(product._id) }}
                                                className="mt-2 w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300 cursor-pointer flex items-center justify-center"
                                            >
                                                {
                                                    loadingProducts.includes(product._id) ? <ButtonLoader /> : buttonLabel
                                                }
                                            </button>
                                        </div>
                                        {product.isFeatured && (
                                            <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-3 py-1 rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                )
                            })}
                </div>

            }
        </div>
    );
};

export default CategoryPage;

