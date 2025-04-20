import axios from "../lib/axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
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
      toast.success("Product created successfully");
      set({ loading: false });
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
      set({ screenLoading: false, products: res.data?.products });
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
      const currentProduct = get().products;
      const updatedProducts = currentProduct.map((p) =>
        p._id === id ? { ...p, isFeatured: newProduct.isFeatured } : p
      );
      set({ products: updatedProducts });
      toast.success(res?.data?.message);
      return { success: true };
    } catch (error) {
      console.log(
        "Error in toggling featured product:",
        error?.response?.data?.message
      );
      toast.error(
        error?.response?.data?.message || "Unable to toogle featured"
      );
      return false;
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ screenLoading: true });
      const res = await axios.delete(`/products/${id}`);
      const currentProduct = get().products;
      const updatedProducts = currentProduct.filter((p) => p._id !== id);
      set({ products: updatedProducts });
      toast.success(res?.data?.message || "Product deleted");
      set({ screenLoading: false });
      return { success: true };
    } catch (error) {
      console.log("Error deleting product :", error.message);
      toast.error(
        error?.response?.data?.message || "Product couldn't be deleted"
      );
      return false;
    }
  },
}));
