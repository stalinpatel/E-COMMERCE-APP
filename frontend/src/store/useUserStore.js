import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

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
      toast.success("User registered Successfully. Proceed to Login !");
      return { success: true };
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data.message || "An error occured in Signup reducer"
      );
      return false;
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data.user, loading: false });
      toast.success(res.data.message);
      return { success: true };
    } catch (error) {
      set({ loading: false });
      console.log("Error in login reducrer ", error);
      toast.error(
        error?.response?.data.message || "An error occured in Logiin reducer"
      );
      return false;
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data.user, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },

  logout: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.post("/auth/logout");
      set({ checkingAuth: false, user: null });
      console.log("res ", res);

      toast.success(res.data?.message);
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },
}));
