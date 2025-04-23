import axios from "../lib/axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { validateCouponForm } from "../utils/validateCouponFormData";

export const useCouponStore = create((set, get) => ({
  allCoupons: [],
  buttonLoading: false,
  screenLoading: false,
  loadingCouponsIds: [],

  createCoupon: async ({ code, expirationDate, discountPercentage }) => {
    try {
      if (!validateCouponForm) return false;
      set({ buttonLoading: true });
      const res = await axios.post("/coupons", {
        code,
        expirationDate,
        discountPercentage,
      });
      console.log("res.data", res.data);
      const prevData = get().allCoupons;
      set({
        allCoupons: [...prevData, res.data],
      });
      toast.success("Coupon created successfully!");
      return { success: true };
    } catch (error) {
      console.log("Error in createCoupon in Store", error.message);
      toast.error(
        error?.response?.data?.message ||
          "Failed to create Coupon. Please try again"
      );
      set({ buttonLoading: false });
      return false;
    } finally {
      set({ buttonLoading: false });
    }
  },

  getAllCoupons: async () => {
    try {
      set({ screenLoading: true });
      const res = await axios.get("/coupons");
      set({ allCoupons: res.data });
      return { success: true };
    } catch (error) {
      console.log("Error in getAllCoupons in Store", error.message);
      toast.error(
        error?.response?.data?.message ||
          "Failed to load all Coupons. Please try again"
      );
      return false;
    } finally {
      set({ screenLoading: false });
    }
  },

  deleteCoupon: async (id) => {
    try {
      set((state) => ({ loadingCouponsIds: [...state.loadingCouponsIds, id] }));
      const res = await axios.delete(`/coupons/${id}`);
      if (res.status === 200) {
        const prevData = get().allCoupons;
        set({ allCoupons: prevData.filter((item) => item._id !== id) });
        toast.success(res.data?.message || "Coupon deleted Successfully");
        return { success: true };
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.log("Error in deleteCoupon in Store", error.message);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while deleting the coupon. Try again."
      );
      return false;
    } finally {
      set((state) => ({
        loadingCouponsIds: state.loadingCouponsIds.filter((cId) => cId !== id),
      }));
    }
  },

  editCoupon: async (id, couponFormData) => {
    try {
      set((state) => ({ loadingCouponsIds: [...state.loadingCouponsIds, id] }));
      const res = await axios.patch(`/coupons/${id}`, couponFormData);
      if (res.status === 200) {
        const prevData = get().allCoupons;
        set({
          allCoupons: prevData.map((item) =>
            item._id === id ? res.data : item
          ),
        });
        toast.success(res.data?.message || "Coupon Updated");
        return { success: true };
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.log("Error in editCoupon in Store", error.message);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while updating the coupon. Try again."
      );
      return false;
    } finally {
      set((state) => ({
        loadingCouponsIds: state.loadingCouponsIds.filter((cId) => cId !== id),
      }));
    }
  },

  toggleActiveStatus: async (id) => {
    try {
      const res = await axios.patch(`/coupons/toggle-status/${id}`);
      if (res.status === 200) {
        const prevData = get().allCoupons;
        set({
          allCoupons: prevData.map((item) =>
            item._id === id ? res.data : item
          ),
        });
        toast.success(
          res.data?.isActive === true
            ? "Coupon Activated"
            : "Coupon Deactivated" || "Coupon toggled successfully"
        );
        return { success: true };
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.log("Error in toggleActiveStatus in Store", error.message);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while toggling the status. Try again."
      );
      return false;
    }
  },
}));
