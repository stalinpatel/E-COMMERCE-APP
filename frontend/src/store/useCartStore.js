import axios from "../lib/axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";

const initialCouponState = {
  code: "",
  isVerified: false,
  discountPercentage: 0,
};

export const useCartStore = create((set, get) => ({
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  discount: 0,
  discountedPrice: 0,
  buttonLoading: false,
  screenLoading: false,
  coupons: [],
  couponApplied: initialCouponState,

  calculateCartTotals: () => {
    const { cartItems, couponApplied } = get();

    const totalItems = cartItems.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
      0
    );
    if (couponApplied.isVerified) {
      set({
        discountedPrice:
          totalPrice - totalPrice * couponApplied.discountPercentage * 0.01,
      });
    }
    set({ totalItems, totalPrice });
  },

  addToCart: async (productId) => {
    try {
      set({ buttonLoading: true });
      const res = await axios.post("/cart/", { productId });
      set({
        buttonLoading: false,
        cartItems: res.data,
      });
      toast.success("Product added to cart");
      get().calculateCartTotals(); // ✅ Call it here
      return { success: true };
    } catch (error) {
      console.log("Error in adding to cart :", error.message);
      toast.error(
        error?.response?.data?.message || "Product couldn't be added to cart"
      );
      set({ screenLoading: false });
      return false;
    }
  },

  getCartProducts: async () => {
    try {
      set({ screenLoading: true });
      const res = await axios.get("/cart/");
      set({ cartItems: res.data, screenLoading: false });
      get().calculateCartTotals(); // ✅ Call it here
      return { success: true };
    } catch (error) {
      console.log("Error in fetching cart Products:", error.message);
      toast.error(
        error?.response?.data?.message || "Cart products couldn't be fetched"
      );
      set({ screenLoading: false });
      return false;
    }
  },

  removeAllFromCart: async (productId) => {
    try {
      const res = await axios.delete("/cart", { data: { productId } });
      const { cartItems } = get();
      const updatedItems = cartItems.filter(
        (item) => item.productId !== productId
      );
      set({ cartItems: updatedItems });
      get().calculateCartTotals();
      return { success: true };
    } catch (error) {
      console.log("Error in deleting  cart Products:", error.message);
      toast.error(
        error?.response?.data?.message || "Cart products couldn't be deleted"
      );
      set({ screenLoading: false });
      return false;
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ buttonLoading: true });
    const prevCart = get().cartItems;
    let updatedItems;
    if (quantity === 0) {
      updatedItems = prevCart.filter((item) => item.productId !== productId);
    } else {
      updatedItems = prevCart.map((item) => {
        return item.productId === productId ? { ...item, quantity } : item;
      });
    }
    set({ cartItems: updatedItems, buttonLoading: false });
    try {
      const res = await axios.put(`/cart/${productId}`, { quantity });
      get().calculateCartTotals();
      return { success: true };
    } catch (error) {
      // ❌ Backend failed - revert to previous state
      set({ cartItems: prevCart });
      console.log("Error in deleting  cart Products:", error.message);
      toast.error(
        error?.response?.data?.message ||
          "Failed to update quantity. Please try again"
      );
      set({ screenLoading: false });
      return false;
    }
  },

  getAllCoupons: async (userId) => {
    try {
      const res = await axios.get("/coupons");
      set({ coupons: res.data });
      console.log("coupons :", res.data);
      return { success: true };
    } catch (error) {
      console.log("Error in fetching All Coupons:", error.message);
      toast.error(
        error?.response?.data?.message || "Coupons couldn't be fetched"
      );
      return false;
    }
  },

  validateCoupon: async (code) => {
    try {
      const res = await axios.post("/coupons/validate", { code });
      set((state) => ({
        couponApplied: {
          ...state.couponApplied,
          code: res.data?.code,
          isVerified: res.data?.isVerified,
          discountPercentage: res.data?.discountPercentage,
        },
      }));
      toast.success(
        `'${get().couponApplied.code || "Coupon"}'  applied successfully`,
        {
          id: res.data?.code,
        }
      );
      get().calculateCartTotals();
      return { success: true };
    } catch (error) {
      if (error?.response?.status === 404) {
        set((state) => ({
          couponApplied: {
            ...state.couponApplied,
            code: "",
            isVerified: false,
            discountPercentage: 0,
          },
        }));
        toast.error("Invalid Coupon");
      } else {
        toast.error(
          error?.response?.data?.message || "Coupon couldn't be validated"
        );
      }
      console.log("Error in validating Coupon:", error.message);
      return false;
    }
  },

  removeCoupon: () => {
    set({ couponApplied: initialCouponState });
    get().calculateCartTotals();
    toast.success("Coupon Removed");
  },

  evaluateCartTotals: async () => {
    try {
      const { couponApplied } = get();
      const res = await axios.post("/cart/evaluate-totals", {
        code: couponApplied.code,
      });
      console.log("Total price fetched :", res.data?.total);
      toast.success(`Total price fetched :${res.data?.total}`);
      set({
        totalPrice: res.data?.originalTotal,
        discount: res.data?.discount,
        discountedPrice: res.data?.total,
      });
      return { success: true };
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Total couldn't be calculated"
      );
      console.log("Error in evaluateCartTotals :", error.message);
      return false;
    }
  },
}));
