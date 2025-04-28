import React, { useState, useEffect } from 'react';
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
    const savedTab = localStorage.getItem("admin-tab") || "create";
    const [activeTab, setActiveTab] = useState(savedTab)
    const { getAllProducts } = useProductStore();

    useEffect(() => {
        getAllProducts();
    }, []);

    useEffect(() => {
        localStorage.setItem("admin-tab", activeTab)
    }, [activeTab])



    return (
        <div className="flex pt-6 flex-col items-center min-h-screen bg-slate-950 text-white ">
            <motion.h2
                initial={{ opacity: 0, y: -20 }} // Start state
                animate={{ opacity: 1, y: 0 }} // End state
                transition={{ duration: 0.8, delay: 0.2 }} // Duration of animation
                className=" text-md sm:text-xl md:text-3xl py-1 md:py-2 font-bold text-center text-pink-500 transition-all  duration-200"
            >
                Admin Dashboard
            </motion.h2>
            <div className='grid  grid-cols-4 my-4 gap-y-1 md:gap-y-2 md:my-6 text-white gap-x-4 px-4'>
                {
                    tabs.map((tab) => {
                        return (<button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col md:flex-row  md:gap-x-2 p-1 md:p-3  cursor-pointer   rounded-lg shadow-lg font-bold  items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis transition-all  duration-200 ${activeTab === tab.id ? "bg-pink-900" : "bg-slate-900"}`}>
                            <tab.icon className='scale-80 md:scale-100' />
                            <span className='text-xs md:text-lg scale-80 md:scale-100 whitespace-nowrap overflow-hidden text-ellipsis'>
                                {tab.label}
                            </span>
                        </button>)
                    })
                }

            </div>
            {activeTab === "create" && <CreateProductForm />}
            {activeTab === "products" && <ProductsList />}
            {activeTab === "coupons" && <CouponsTab />}
            {activeTab === "analytics" && <AnalyticsTab />}

        </div >
    );
};

export default AdminPage;