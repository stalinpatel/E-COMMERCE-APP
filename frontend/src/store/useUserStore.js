import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  orders: [],
  loadingOrders: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      toast.error("Password do not match");
      return false;
    }
    const userData = { name, email, password };
    try {
      const res = await axios.post("/auth/signup", userData);
      set({
        user: res.data.user,
        loading: false,
      });
      get().checkAuth();
      toast.success("User registered Successfully. Proceed to Login !");
      return { success: true };
    } catch (error) {
      toast.error(
        error?.response?.data.message || "An error occured in Signup reducer"
      );
      return false;
    } finally {
      set({ loading: false });
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data.user });
      toast.success(res.data.message);
      return { success: true };
    } catch (error) {
      set({ loading: false });
      console.log("Error in login in Store ", error);
      toast.error(
        error?.response?.data.message || "An error occured in Login reducer"
      );
      return false;
    } finally {
      set({ loading: false });
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data.user, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    } finally {
      set({ checkingAuth: false });
    }
  },

  logout: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.post("/auth/logout");
      toast.success(res.data?.message, { id: "expired" });
      return { success: true };
    } catch (error) {
      set({ user: null });
    } finally {
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    try {
      set({ loading: true });
      const res = await axios.post("/auth/refresh-token");
      if (res.data.success) {
        console.log("Token refreshed successfully");
        return { success: true };
      }
    } catch (error) {
      set({ checkingAuth: false, loading: false });
      console.error("Token couldn't be refreshed", error.message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getAllOrders: async () => {
    set({ loadingOrders: true });
    try {
      const res = await axios.get("/orders");
      set({ orders: res.data?.orders });
      return { success: true };
    } catch (error) {
      console.error("Error in gerAllOrders :", error);
      return false;
    } finally {
      set({ loadingOrders: false });
    }
  },
}));
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const user = useUserStore.getState().user;
      if (!user) {
        return Promise.reject(error);
      }

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        console.log("✅ Access token refreshed, retrying original request...");

        return axios(originalRequest);
      } catch (error) {
        await axios.post("/auth/logout");
        toast.error("Session Expired! Please login again.", { id: "expired" });

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
