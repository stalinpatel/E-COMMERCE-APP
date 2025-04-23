import React, { useEffect, useState } from 'react';
import PinkButtonSpinner from "./PinkButtonSpinner"
import { useCouponStore } from '../store/useCouponStore';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import isEqual from 'fast-deep-equal';
import { validateCouponForm } from '../utils/validateCouponFormData';
import { formatDateForInput } from "../utils/dateHelpers"

const EditCouponModal = (
    {
        toggleIsModalOpen,
        existingData,
        isModalOpen
    }
) => {

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isModalOpen) {
                toggleIsModalOpen(); // 👈 close the modal
            }
        };
        window.addEventListener("keydown", handleKeyDown);

        // Cleanup on unmount 🔥
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    const blankState = {
        code: '',
        discountPercentage: '',
        expirationDate: '',
    }
    const { editCoupon, buttonLoading } = useCouponStore();
    const [isDisabled, setIsDisabled] = useState(false)
    const [couponFormData, setCouponFormData] = useState(existingData
        ? { ...existingData, expirationDate: formatDateForInput(existingData.expirationDate), }
        : blankState);


    useEffect(() => {
        const isFormUnchanged = isEqual(existingData, couponFormData)
        setIsDisabled(isFormUnchanged)
    }, [existingData, couponFormData])

    const handleChange = (e) => {
        setCouponFormData({ ...couponFormData, [e.target.name]: e.target.value });
    };




    const handleUpdateCoupoon = async (id, couponFormData) => {
        console.log('CouponFormData:', couponFormData);
        if (!validateCouponForm(couponFormData)) return;
        if (isDisabled) return;
        const res = await editCoupon(id, couponFormData)
        res?.success && toggleIsModalOpen()
        return;
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40"
                onClick={toggleIsModalOpen}
            />

            <motion.div
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: "0", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-slate-800 p-6 rounded-2xl shadow-lg w-[90%] max-w-md"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">
                        Update Coupon
                    </h3>
                    <button onClick={toggleIsModalOpen}>
                        <X className="text-white hover:text-red-500 transition" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="coupon-code" className="text-sm text-gray-300">Coupon Code</label>
                        <input
                            id="coupon-code"
                            type="text"
                            name='code'
                            value={couponFormData.code}
                            onChange={(e) => handleChange(e)}
                            placeholder="e.g : WELCOME"
                            className="w-full p-2 rounded-md bg-slate-700 text-white"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="discount" className="text-sm text-gray-300">Discount %</label>
                        <input
                            id="discount"
                            type="number"
                            name='discountPercentage'
                            value={couponFormData.discountPercentage}
                            onChange={(e) => handleChange(e)}
                            placeholder="e.g: 10%"
                            className="w-full p-2 rounded-md bg-slate-700 text-white"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="expiration-date" className="text-sm text-gray-300">Expiration Date</label>
                        <input
                            id="expiration-date"
                            type="date"
                            name='expirationDate'
                            min={new Date().toISOString().split('T')[0]} // 🛡 disables past dates
                            value={couponFormData.expirationDate}
                            onChange={(e) => handleChange(e)}
                            className="w-full p-2 rounded-md bg-slate-700 text-white"
                            required
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button
                        onClick={toggleIsModalOpen}
                        className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleUpdateCoupoon(existingData._id, couponFormData)}
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded-lg   text-white w-32 flex items-center justify-center  ${isDisabled ? "bg-pink-900 text-slate-600" : "hover:bg-pink-700 bg-pink-600 cursor-pointer"}`}
                    >
                        {
                            buttonLoading ? <PinkButtonSpinner /> : "Update"
                        }
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default EditCouponModal;