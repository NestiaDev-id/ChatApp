import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignedUp: false,
  isLogginIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      // set({ user: res.data.user, isCheckingAuth: false });
      set({ authUser: res.data });
    } catch (e) {
      console.log("Error in checkAuth: " + e);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (formData) => {
    set({ isSignedUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: res.data });
      toast.success("Sign up success!");
    } catch (e) {
      toast.error(e.response.data.message);
    } finally {
      set({ isSignedUp: false });
    }
  },

  login: async (formData) => {
    set({ isLogginIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data });
      toast.success("Login success!");
    } catch (e) {
      toast.error(e.response.data.message);
    } finally {
      set({ isLogginIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout success!");
    } catch (error) {
      toast.error("Error logging out");
    }
  },
  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", formData);
      set({ authUser: res.data });
      toast.success("Profile updated!");
    } catch (e) {
      toast.error(e.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
