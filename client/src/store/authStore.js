import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../api/axiosConfig";

export const loginStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",

    login: async (credentials) => {
      set({ loading: true, success: false, error: false, message: "" });
      try {
        const response = await axiosInstance.post("/auth/login", credentials, {
          withCredentials: true,
        });

        if (response.data?.success) {
          set({
            loading: false,
            success: true,
            error: false,
            message: response.data.success,
          });
        } else {
          set({
            loading: false,
            success: false,
            error: true,
            message: response.data?.error || "Login failed",
          });
        }
      } catch (err) {

        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.message || "Something went wrong",
        });
      }
    },

    reset: () =>
      set({ loading: false, success: false, error: false, message: "" }),
  }))
);
export const authCheckStore = create(
  devtools((set) => ({
    loading: true,
    success: false,
    error: false,
    message: null,

    authCheck: async () => {
      set({ loading: true });
      try {
        const response = await axiosInstance.get("/auth/check");
        if (response.data?.success) {
          set({ loading: false, success: true, message: response.data });
        } else {
          set({ loading: false, success: false, message: null });
        }
      } catch (err) {
        set({ loading: false, success: false, error: true });
      }
    },

    reset: () =>
      set({ loading: false, success: false, message: null, error: false }),
  }))
);
export const logoutStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",

    logout: async () => {
      set({ loading: true, success: false, error: false, message: "" });

      try {
        const response = await axiosInstance.post(
          "/auth/logout",
          {},
          { withCredentials: true }
        );

        if (response.data?.success) {
          loginStore.getState().reset();
          authCheckStore.getState().reset();

          set({
            loading: false,
            success: true,
            error: false,
            message: response.data.success,
          });
        }
      } catch (err) {
  
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.error || "Something went wrong",
        });
      }
    },

    reset: () =>
      set({ loading: false, success: false, error: false, message: "" }),
  }))
);

export const refreshStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",

    refreshToken: async () => {
      set({ loading: true, success: false, error: false, message: "" });

      try {
        const response = await axiosInstance.post(
          "/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        if (response.data?.success) {
          set({
            loading: false,
            success: true,
            error: false,
            message: "Token refreshed successfully",
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.error || "Something went wrong",
        });
      }
    },

    reset: () =>
      set({ loading: false, success: false, error: false, message: "" }),
  }))
);

