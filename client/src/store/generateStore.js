import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../api/axiosConfig";


export const generateIDStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",

    generateId: async (credentials) => {
      set({ loading: true, success: false, error: false, message: "" });
      try {
        const response = await axiosInstance.post(
          "/id-cards",
          credentials,
          {
            withCredentials: true,
          }
        );

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
          message: err.response?.data?.error || "Something went wrong",
        });
      }
    },

    reset: () => set({ loading: false, success: false, error: false, message: "" }),
  }))
);

