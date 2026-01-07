import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../api/axiosConfig";

export const getStatsStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: null,
    stats: null,
    getStats: async () => {
      try {
        set({
          loading: true,
          success: false,
          error: false,
          message: null,
          stats: null,
        });
        const res = await axiosInstance.get("/stats/", { withCredentials: true });
        if (res.data && res.data.success) {
          set({
            loading: false,
            success: true,
            error: false,
            stats: res.data.data,
            message: null,
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.message || "Something went wrong.",
          stats: null,
        });
      }
    },
  }))
);