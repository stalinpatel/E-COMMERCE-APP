import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { PlusCircle, ShoppingBasket, BarChart, TicketPercent } from "lucide-react"
import { motion } from "framer-motion"
import CreateProductForm from '../components/CreateProductForm';
import AnalyticsTab from "../components/AnalyticsTab"
import ProductsList from "../components/ProductsList"
import CouponsTab from '../components/CouponsTab';
import { useProductStore } from '../store/useProductStore';

const AdminPage = () => {
    const tabs = [
        { id: "create", label: "Create Product", icon: PlusCircle },
        { id: "products", label: "Products", icon: ShoppingBasket },
        { id: "coupons", label: "Coupons", icon: TicketPercent },
        { id: "analytics", label: "Analytics", icon: BarChart },
    ]
    const [activeTab, setActiveTab] = useState("create")
    const { getAllProducts } = useProductStore();

    useEffect(() => {
        getAllProducts();
    }, []);



    return (
        <div className="flex pt-10 flex-col items-center min-h-screen bg-slate-950 text-white ">
            <motion.h2
                initial={{ opacity: 0, y: -20 }} // Start state
                animate={{ opacity: 1, y: 0 }} // End state
                transition={{ duration: 0.8, delay: 0.2 }} // Duration of animation
                className="text-3xl font-bold text-center text-pink-500 py-6"
            >
                Admin Dashboard
            </motion.h2>
            <div className='flex my-6 text-white gap-x-4'>
                {
                    tabs.map((tab) => {
                        return (<button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex gap-x-2 cursor-pointer transition-colors duration-200  p-3 rounded-lg shadow-lg font-bold w-50 items-center justify-center ${activeTab === tab.id ? "bg-pink-900" : "bg-slate-900"}`}>
                            <tab.icon />{tab.label}
                        </button>)
                    })
                }

            </div>
            {activeTab === "create" && <CreateProductForm />}
            {activeTab === "products" && <ProductsList />}
            {activeTab === "analytics" && <AnalyticsTab />}
            {activeTab === "coupons" && <CouponsTab />}

        </div >
    );
};

export default AdminPage;