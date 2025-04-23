import React, { useEffect, useState } from 'react';
import { TicketPercent, Edit, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PinkButtonSpinner from "../components/PinkButtonSpinner"
import { useCouponStore } from '../store/useCouponStore';
import AddCouponModal from './AddCouponModal';
import EditCouponModal from "./EditCouponModal"
import CouponTableSkeleton from "./skeletons/CouponTableSkeleton"


const CouponsTab = () => {
  const { getAllCoupons, allCoupons, deleteCoupon, loadingCouponsIds, screenLoading, toggleActiveStatus } = useCouponStore();
  const [updatingFormData, setUpdatingFormData] = useState({})
  const [isAddCouponModalShown, setIsAddCouponModalShown] = useState(false)
  const [isEditCouponModalShown, setIsEditCouponModalShown] = useState(false)
  useEffect(() => {
    getAllCoupons();
  }, [getAllCoupons])

  const toggleCouponStatus = (id) => {
    toggleActiveStatus(id)
  };
  const toggleIsAddCouponModalShown = () => {
    setIsAddCouponModalShown(state => !state)
  }
  const toggleIsEditCouponModalShown = () => {
    setIsEditCouponModalShown(state => !state)
  }

  const handleDeleteCoupon = (id) => {
    deleteCoupon(id)
  };
  const handleEditClick = (coupon) => {
    setUpdatingFormData(coupon)
    toggleIsEditCouponModalShown();
  };

  if (screenLoading) {
    return <CouponTableSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-center text-pink-500 mb-6">Manage Coupons</h2>

      <div className="flex justify-end mb-4">
        <button onClick={toggleIsAddCouponModalShown} className="bg-pink-500 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-pink-600 cursor-pointer">
          <TicketPercent size={20} /> Add Coupon
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-white border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-pink-400 text-sm uppercase">
              <th>Coupon Code</th>
              <th>Discount %</th>
              <th>Expiration Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allCoupons.length > 0 ? (
              allCoupons.map(coupon => (
                <tr key={coupon._id} className="bg-slate-800 rounded-lg text-sm">
                  <td className="p-3">{coupon.code}</td>
                  <td className='pl-5'>{coupon.discountPercentage} %</td>
                  <td className='pl-5'>{coupon.expirationDate}</td>
                  <td >
                    <button
                      onClick={() => toggleCouponStatus(coupon._id)}
                      className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:scale-105 active:scale-110 transition duration-500 ease-in-out"
                    >
                      {coupon.isActive ? (
                        <ToggleRight size={26} className="text-green-500 " />
                      ) : (
                        <ToggleLeft size={26} className="text-red-500 " />
                      )}
                      {coupon.isActive ? 'Active' : 'Not Active'}
                    </button>
                  </td>
                  <td className="flex gap-5 items-center item-center pt-3">
                    <button
                      onClick={() => handleEditClick(coupon)}
                      className="text-yellow-400 hover:text-yellow-500 transition cursor-pointer"
                    >
                      <Edit size={22} />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      className="text-red-600 hover:text-red-700 transition cursor-pointer"
                    >{
                        loadingCouponsIds.includes(coupon._id) ? <PinkButtonSpinner /> : <Trash2 size={22} />
                      }
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-300 py-4">
                  No coupons available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <AnimatePresence>
          {isAddCouponModalShown && <AddCouponModal
            toggleIsModalOpen={() => toggleIsAddCouponModalShown()}
            isModalOpen={isAddCouponModalShown}
          />}
          {isEditCouponModalShown && <EditCouponModal
            toggleIsModalOpen={() => toggleIsEditCouponModalShown()}
            isModalOpen={isEditCouponModalShown}
            existingData={updatingFormData}
          />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CouponsTab;
