import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from '../store/useProductStore';
import { useUserStore } from "../store/useUserStore";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import ButtonLoader from './skeletonsAndLoders/ButtonLoader';
import ProductCardSkeleton from './skeletonsAndLoders/ProductCardSkeleton';

const FeaturedProductsSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const { featuredProducts, screenLoading } = useProductStore();
    const { user } = useUserStore();
    const { addToCart, cartItems } = useCartStore();
    const [loadingProducts, setLoadingProducts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(1);
            else if (window.innerWidth < 1024) setItemsPerPage(2);
            else if (window.innerWidth < 1280) setItemsPerPage(3);
            else setItemsPerPage(4);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + itemsPerPage;
            // Ensure we don't go beyond the end of the list
            return nextIndex >= featuredProducts.length ? prevIndex : nextIndex;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex - itemsPerPage;
            // Ensure we don't go below the beginning of the list
            return nextIndex < 0 ? 0 : nextIndex;
        });
    };


    const isStartDisabled = currentIndex === 0;
    const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

    const handleAddToCart = (productId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (cartItems.some(item => item.productId === productId)) {
            navigate("/cart");
            return;
        }

        setLoadingProducts((prev) => [...prev, productId]);
        addToCart(productId).finally(() => {
            setLoadingProducts((prev) => prev.filter(id => id !== productId));
        });
    };

    return (
        <section className="py-2 md:py-14 px-6">
            <h2 className=" text-md sm:text-xl md:text-3xl lg:text-4xl font-bold text-center whitespace-nowrap overflow-hidden text-ellipsis my-2 md:my-4 lg:mb-6">🔥 Featured Products</h2>
            <div className="relative">
                {screenLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                ) : featuredProducts.length === 0 ? (
                    <div className="col-span-full flex items-center justify-center">
                        <div className="text-gray-400 text-2xl px-6 py-4 rounded-xl font-bold text-center">
                            No Featured Products Found
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-300 ease-in-out"
                                style={{
                                    transform: `translateX(-${(currentIndex / featuredProducts.length) * 100}%)`,
                                    width: `${(featuredProducts.length / itemsPerPage) * 100}%`, // Width should account for how many items you're displaying
                                }}
                            >
                                {featuredProducts.map((product) => {
                                    const buttonLabel = cartItems.some(item => item.productId === product._id)
                                        ? "Go to Cart"
                                        : "Add to Cart";
                                    return (
                                        <div
                                            key={product._id}
                                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
                                        >
                                            <div className={`bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 relative`}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="p-4">
                                                    <h3 className="text-xl font-semibold mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-pink-400 font-bold">${product.price}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleAddToCart(product._id)}
                                                    className="mt-2 w-[80%] mx-auto mb-6 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300 cursor-pointer flex items-center justify-center"
                                                    disabled={loadingProducts.includes(product._id)}
                                                >
                                                    {loadingProducts.includes(product._id) ? (
                                                        <ButtonLoader />
                                                    ) : (
                                                        <>
                                                            {buttonLabel === "Add to Cart" && <ShoppingCart className="w-5 h-5 mr-2" />}
                                                            {buttonLabel}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <button
                            onClick={prevSlide}
                            disabled={isStartDisabled}
                            className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-500"
                                }`}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            disabled={isEndDisabled}
                            className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-500"
                                }`}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>
        </section>
    );
};

export default FeaturedProductsSlider;
