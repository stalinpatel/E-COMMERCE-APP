import axios from "../lib/axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  allProducts: [], // renamed
  categoryProducts: [], // new
  featuredProducts: [], // future use
  singleProduct: {},
  loading: false,
  screenLoading: false,

  createProduct: async (formInputData) => {
    set({ loading: true });
    try {
      const formData = new FormData();

      for (const key in formInputData) {
        formData.append(key, formInputData[key]);
      }

      const res = await axios.post("/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newProduct = res.data?.product;
      const currentProducts = get().allProducts; // changed
      set({ allProducts: [newProduct, ...currentProducts], loading: false }); // changed
      toast.success("Product created successfully");
      return { success: true };
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error?.response?.data?.message || "Failed to create product");
      set({ loading: false });
      return false;
    }
  },

  getAllProducts: async () => {
    try {
      set({ screenLoading: true });
      const res = await axios.get("/products");
      set({ screenLoading: false, allProducts: res.data?.products }); // changed
      return { success: true };
    } catch (error) {
      console.log("Error fetching all products");
      toast.error("Products couldn't be fetched");
      return false;
    }
  },

  toggleFeaturedProduct: async (id) => {
    try {
      const res = await axios.patch(`/products/${id}`);
      const newProduct = res.data?.updatedProduct;
      const currentProduct = get().allProducts; // changed
      const updatedProducts = currentProduct.map((p) =>
        p._id === id ? { ...p, isFeatured: newProduct.isFeatured } : p
      );
      set({ allProducts: updatedProducts }); // changed
      toast.success(res?.data?.message);
      return { success: true };
    } catch (error) {
      console.log(
        "Error in toggling featured product:",
        error?.response?.data?.message
      );
      toast.error(
        error?.response?.data?.message || "Unable to toggle featured"
      );
      return false;
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true });
      const res = await axios.delete(`/products/${id}`);
      const currentProduct = get().allProducts; // changed
      const updatedProducts = currentProduct.filter((p) => p._id !== id);
      set({ allProducts: updatedProducts }); // changed
      toast.success(res?.data?.message || "Product deleted");
      set({ loading: false });
      return { success: true };
    } catch (error) {
      console.log("Error deleting product :", error.message);
      toast.error(
        error?.response?.data?.message || "Product couldn't be deleted"
      );
      return false;
    }
  },

  fetchProductByCategory: async (category) => {
    try {
      set({ screenLoading: true });
      const res = await axios.get(`/products/category/${category}`);
      set({ categoryProducts: res.data || [], screenLoading: false }); // new key
      return { success: true };
    } catch (error) {
      console.log("Error fetching products :", error.message);
      toast.error(
        error?.response?.data?.message || "Product couldn't be fetched"
      );
      set({ screenLoading: false });
      return false;
    }
  },

  getFeaturedProducts: async () => {
    try {
      set({ screenLoading: true });
      const res = await axios.get("/products/featured");
      set({ featuredProducts: res.data || [], screenLoading: false }); // new key
      return { success: true };
    } catch (error) {
      console.log("Error fetching products :", error);
      console.error(
        error?.response?.data?.message || "Product couldn't be fetched"
      );
      set({ screenLoading: false });
      return false;
    }
  },
}));
