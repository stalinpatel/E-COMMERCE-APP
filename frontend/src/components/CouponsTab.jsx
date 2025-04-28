import React, { useEffect, useState } from 'react';
import { TicketPercent, Edit, Trash2, ToggleLeft, ToggleRight, ChevronUp, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PinkButtonSpinner from "../components/skeletonsAndLoders/PinkButtonSpinner";
import { useCouponStore } from '../store/useCouponStore';
import AddCouponModal from './AddCouponModal';
import EditCouponModal from "./EditCouponModal";
import CouponTableSkeleton from "./skeletonsAndLoders/CouponTableSkeleton";

const CouponsTab = () => {
  const { getAllCoupons, allCoupons, deleteCoupon, loadingCouponsIds, screenLoading, toggleActiveStatus } = useCouponStore();
  const [updatingFormData, setUpdatingFormData] = useState({});
  const [isAddCouponModalShown, setIsAddCouponModalShown] = useState(false);
  const [isEditCouponModalShown, setIsEditCouponModalShown] = useState(false);
  const [expandedCoupon, setExpandedCoupon] = useState(null);

  useEffect(() => {
    getAllCoupons();
  }, [getAllCoupons]);

  const toggleCouponStatus = (id) => {
    toggleActiveStatus(id);
  };

  const toggleIsAddCouponModalShown = () => {
    setIsAddCouponModalShown(state => !state);
  };

  const toggleIsEditCouponModalShown = () => {
    setIsEditCouponModalShown(state => !state);
  };

  const handleDeleteCoupon = (id) => {
    deleteCoupon(id);
  };

  const handleEditClick = (coupon) => {
    setUpdatingFormData(coupon);
    toggleIsEditCouponModalShown();
  };

  const toggleExpandCoupon = (id) => {
    setExpandedCoupon(expandedCoupon === id ? null : id);
  };

  if (screenLoading) {
    return <CouponTableSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-slate-900 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto"
    >
      <h2 className="text-xl md:text-2xl font-bold text-center text-pink-500 mb-4">Manage Coupons</h2>

      <div className="flex justify-center md:justify-end mb-4">
        <button
          onClick={toggleIsAddCouponModalShown}
          className="bg-pink-500 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-pink-600 transition-colors duration-200"
        >
          <TicketPercent size={20} />
          <span className="hidden sm:inline">Add Coupon</span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-white border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-pink-400 text-sm uppercase">
              <th className="p-3">Coupon Code</th>
              <th className="p-3">Discount %</th>
              <th className="p-3">Expiration Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allCoupons.length > 0 ? (
              allCoupons.map(coupon => (
                <tr key={coupon._id} className="bg-slate-800 rounded-lg text-sm">
                  <td className="p-3">{coupon.code}</td>
                  <td className="p-3">{coupon.discountPercentage}%</td>
                  <td className="p-3">{coupon.expirationDate}</td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleCouponStatus(coupon._id)}
                      className="flex items-center gap-2 font-medium cursor-pointer hover:scale-105 active:scale-110 transition duration-200"
                    >
                      {coupon.isActive ? (
                        <ToggleRight size={26} className="text-green-500" />
                      ) : (
                        <ToggleLeft size={26} className="text-red-500" />
                      )}
                      <span>{coupon.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() => handleEditClick(coupon)}
                        className="text-yellow-400 hover:text-yellow-500 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="text-red-600 hover:text-red-700 transition-colors duration-200"
                        title="Delete"
                      >
                        {loadingCouponsIds.includes(coupon._id) ? (
                          <PinkButtonSpinner size={20} />
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    </div>
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
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {allCoupons.length > 0 ? (
          allCoupons.map(coupon => (
            <div
              key={coupon._id}
              className="bg-slate-800 rounded-lg p-3 text-sm relative"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpandCoupon(coupon._id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <TicketPercent size={18} className="text-pink-500" />
                    <p className="font-medium truncate">{coupon.code}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {coupon.discountPercentage}% off • Expires {coupon.expirationDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCouponStatus(coupon._id);
                    }}
                    className="hover:scale-105 active:scale-110 transition duration-200"
                  >
                    {coupon.isActive ? (
                      <ToggleRight size={20} className="text-green-500" />
                    ) : (
                      <ToggleLeft size={20} className="text-red-500" />
                    )}
                  </button>
                  {expandedCoupon === coupon._id ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedCoupon === coupon._id && (
                <div className="mt-3 pt-3 border-t border-slate-700 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Discount:</span>
                    <span>{coupon.discountPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expires:</span>
                    <span>{coupon.expirationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span>{coupon.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleEditClick(coupon)}
                      className="text-yellow-400 hover:text-yellow-500 transition flex items-center gap-1"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      className="text-red-500 hover:text-red-600 transition flex items-center gap-1"
                    >
                      {loadingCouponsIds.includes(coupon._id) ? (
                        <PinkButtonSpinner size={16} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-300 py-4">
            No coupons available.
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAddCouponModalShown && (
          <AddCouponModal
            toggleIsModalOpen={toggleIsAddCouponModalShown}
            isModalOpen={isAddCouponModalShown}
          />
        )}
        {isEditCouponModalShown && (
          <EditCouponModal
            toggleIsModalOpen={toggleIsEditCouponModalShown}
            isModalOpen={isEditCouponModalShown}
            existingData={updatingFormData}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CouponsTab;