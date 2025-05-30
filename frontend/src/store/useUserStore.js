import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { persist } from "zustand/middleware";
let refreshPromise = null;

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      checkingAuth: true,
      orders: [],
      loadingOrders: true,
      razorpay_key_id: "",

      clearStorage: () => {
        set({
          user: null,
          orders: [],
          loading: false,
          checkingAuth: false,
          loadingOrders: false,
          razorpay_key_id: "",
        });
        localStorage.removeItem("user-storage");
      },
      loadEnvironmentVariable: async () => {
        try {
          const res = await axios.get("/config/razorpay");
          const key = res.data.key;
          set({ razorpay_key_id: key });
          return { success: true };
        } catch (error) {
          console.log("Error getting the Razorpay key ID", error);
          return false;
        }
      },

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
            error?.response?.data.message ||
              "An error occured in Signup reducer"
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
          get().loadEnvironmentVariable();
          const res = await axios.get("/auth/profile");
          set({ user: res.data.user, checkingAuth: false });
        } catch (error) {
          set({ checkingAuth: false, user: null });
        } finally {
          set({ checkingAuth: false });
        }
      },

      logout: async () => {
        try {
          await axios.post("/auth/logout");
          toast.success("Logged out successfully!", { id: "expired" });
        } catch (error) {
          console.error("Error during logout", error);
        } finally {
          const { clearStorage } = useUserStore.getState();
          clearStorage();
          refreshPromise = null;
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
    }),
    {
      name: "user-storage", // localStorage key
      partialize: (state) => ({
        user: state.user, // only persist user data, not everything
      }),
    }
  )
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { user, refreshToken, logout } = useUserStore.getState();

    const isAccessTokenExpired = error.response?.status === 440;

    // If refresh-token endpoint fails, or no user is logged in, reject immediately
    if (
      isAccessTokenExpired &&
      user &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshToken(); // store.refreshToken returns a promise
        }

        const result = await refreshPromise;
        refreshPromise = null;

        if (result?.success) {
          console.log("✅ Access token refreshed. Retrying request...");
          return axios(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        refreshPromise = null;

        console.error("❌ Refresh failed. Logging out...", refreshError);
        await logout();
        toast.error("Session expired! Please login again.", { id: "expired" });

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
