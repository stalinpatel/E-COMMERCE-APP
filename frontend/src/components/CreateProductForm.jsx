import React, { useEffect } from 'react';
import { useState } from 'react';
import { PlusCircle, Upload, Loader, Cross } from 'lucide-react';
import { motion } from "framer-motion"
import { set } from 'mongoose';
import { useProductStore } from '../store/useProductStore';
import ButtonLoader from "../components/ButtonLoader"



const categories = ["jean", "t-shirt", "shoe", "glasses", "jacket", "suit", "bag"]

const CreateProductForm = () => {
    const initialState = {
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: null,
        preview: null
    };
    const [error, setError] = useState(null);
    const [productData, setProductData] = useState(initialState);
    const { createProduct, loading } = useProductStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };
    const verifyImgPresent = () => {
        if (!productData.image) {
            setError("Image is required")
            return false;
        }
        setError(null)
        return true;
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // 👈 creates preview blob
            setProductData(prev => ({
                ...prev,
                image: file,
                preview: previewUrl
            }));
        }
        setError(null); // Clear error on image select
    };
    const handleCrossClick = (e) => {
        e.preventDefault();
        console.log('cancelled');
        if (!verifyImgPresent()) return;
        setProductData(prev => ({
            ...prev,
            image: null,
            preview: null
        }))
        setError("Image is required"); // Show error again
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!verifyImgPresent()) return;

        const res = await createProduct(productData)

        if (res?.success) {
            setProductData(initialState)
        }

    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-slate-900 px-8 pt-4 pb-8 rounded-lg shadow-lg w-96"
        >
            <h2 className="text-xl font-bold text-center text-pink-500 py-4">Create New Product</h2>

            <form onSubmit={handleSubmit} >
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={productData.name}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:ring-pink-500 focus:ring-2 outline-0 "
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={productData.description}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:ring-pink-500 focus:ring-2 outline-0 "
                    rows={4}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={productData.price}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:ring-pink-500 focus:ring-2 outline-0 "
                    required
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={productData.stock}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:ring-pink-500 focus:ring-2 outline-0 "
                    required
                />

                <select
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 rounded-lg bg-slate-800 text-white focus:ring-pink-500 focus:ring-2 outline-0 "
                    required
                >
                    <option value="" disabled>Select a category</option>
                    {
                        categories.map((category) => {
                            return (
                                <option key={category} value={`${category}`}> {`${category}`}</option>
                            )
                        })
                    }

                </select>



                <div className="mb-4 flex ">
                    <input
                        type="file"
                        id='image'
                        accept='image/*'
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label htmlFor='image' className="text-white mb-1 flex bg-green-900 rounded-md p-2 cursor-pointer gap-x-1 pr-3   active:bg-green-950">
                        <Upload className='scale-75 ' />  Upload Image
                    </label>
                    {error && (
                        <motion.p
                            className='text-red-600 ml-4 pt-2'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            *{error}
                        </motion.p>
                    )}
                </div>
                {productData.preview && (
                    <div className="mb-4 relative">
                        <p className="text-white text-sm mb-1">Image Preview:</p>
                        <img
                            src={productData.preview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border-2 border-pink-500"
                        />
                        <button onClick={handleCrossClick}>
                            <Cross className="rotate-45 absolute -right-1 top-4 border-3 border-red-800 rounded-full fill-red-900 font-semibold cursor-pointer" />
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full py-2 bg-pink-500 hover:bg-pink-600 active:bg-pink-950 text-white font-semibold rounded-lg flex justify-center items-center gap-2"
                >
                    {
                        loading && <ButtonLoader />
                    }
                    {
                        !loading &&
                        <span className='flex gap-x-2'>
                            <PlusCircle /> Create Product
                        </span>
                    }
                </button>
            </form>


        </motion.div >
    );
};

export default CreateProductForm;