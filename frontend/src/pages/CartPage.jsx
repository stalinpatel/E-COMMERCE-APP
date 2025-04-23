import React, { useEffect, useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Trash2 } from 'lucide-react';
import CartPageSkeleton from "../components/skeletons/CartPageSkeleton"
import PinkButtonSpinner from "../components/PinkButtonSpinner"
import NoCartItemsFound from '../components/NoCartItemsFound';
import toast from 'react-hot-toast';

const CartPage = () => {
    const { cartItems, getCartProducts, removeAllFromCart, totalPrice, screenLoading, updateQuantity } = useCartStore();
    const [deletingItemId, setDeletingItemId] = useState(null);

    useEffect(() => {
        getCartProducts();
    }, []);

    const handleDelete = async (productId) => {
        setDeletingItemId(productId);
        await removeAllFromCart(productId);
        setDeletingItemId(null);
    };
    const handleQuantityChange = async (productId, quantity) => {
        updateQuantity(productId, quantity)
    }
    const increaseByOne = (item) => {
        let quantity = Number(item.quantity) + 1;
        if (quantity > 20) {
            quantity = 20
            toast.error("Max quantity reached")
        }
        handleQuantityChange(item.productId, quantity)
    }
    const decreaseByOne = (item) => {
        const quantity = Math.max(0, Number(item.quantity) - 1)
        handleQuantityChange(item.productId, quantity)
    }

    if (screenLoading) {
        return <CartPageSkeleton />
    }
    if (cartItems.length === 0) {
        return <NoCartItemsFound />
    }
    return (
        <div className="min-h-screen text-white px-6 py-4 w-[80%] mx-auto">
            <h2 className="text-4xl font-bold text-pink-500 mb-8 text-center">Your Cart</h2>

            <div className="space-y-6">
                {cartItems.map((item) => (
                    <div
                        key={item.productId}
                        className="flex items-center bg-slate-800 rounded-2xl shadow-md p-4 sm:p-6 gap-6"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-32 h-28 object-cover rounded-xl cursor-pointer"
                        />

                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-semibold cursor-pointer">{item.name}</h3>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => decreaseByOne(item)} className="bg-pink-500 hover:bg-pink-600 pb-1.5 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md text-xl cursor-pointer">
                                        −
                                    </button>
                                    <input
                                        onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                                        type="text"
                                        inputMode='numeric'
                                        pattern='[0-9]*'
                                        className="text-lg font-medium w-12 text-center border-none outline-none bg-transparent"
                                        value={item.quantity}
                                    />
                                    <button onClick={() => increaseByOne(item)} className="bg-pink-500 hover:bg-pink-600 pb-1.5 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md text-xl cursor-pointer">
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between mt-4">
                                <p className="text-pink-400 font-medium">Price: ₹ {item.price}</p>
                                <p className="text-white font-semibold">Total: ₹ {item.price * item.quantity}</p>
                            </div>
                        </div>

                        {/* Clean Delete Button */}
                        <button
                            onClick={() => handleDelete(item.productId)}
                            className="ml-auto self-center text-pink-400 hover:text-red-500 hover:bg-slate-700 p-2 rounded-full transition-all cursor-pointer"
                            title="Remove Item"
                        >
                            {deletingItemId === item.productId ? (
                                <PinkButtonSpinner />
                            ) : (
                                <Trash2 size={20} />
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-slate-800 p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between">
                <h4 className="text-xl font-semibold text-white">Total:</h4>
                <p className="text-2xl font-bold text-pink-500">₹ {totalPrice}</p>
            </div>

            <div className="mt-8 flex justify-center">
                <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-2xl text-lg shadow-md transition-all duration-300">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default CartPage;
