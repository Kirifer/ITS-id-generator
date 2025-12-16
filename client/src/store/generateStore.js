import axios from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const generateIDStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",

    generateId: async (credentials) => {
      set({ loading: true, success: false, error: false, message: "" });
      try {
        const response = await axios.post(
          `${baseUrl}/id-cards`,
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

