import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../api/axiosConfig";

export const idCardFilterStore = create(
  devtools((set, get) => ({
    loading: false,
    error: false,
    message: "",
    data: [],
    initialized: false,
    isResetting: false,

    filters: {
      type: "",
      status: "",
      search: "",
    },

    setFilter: (key, value) => {
      set((state) => ({
        filters: {
          ...state.filters,
          [key]: value,
        },
      }));
    },

    fetchIdCards: async () => {
      set({ loading: true, error: false, message: "", initialized: true });

      try {
        const { type, status, search } = get().filters;

        const params = {};
        if (type) params.type = type;
        if (status) params.status = status;
        if (search) params.search = search;

        const res = await axiosInstance.get("/filter/", {
          params,
          withCredentials: true,
        });

        set({
          loading: false,
          data: res.data,
        });
      } catch (err) {
        set({
          loading: false,
          error: true,
          message: err.response?.data?.message || "Failed to fetch ID cards",
        });
      }
    },

    resetFilters: () =>
      set({
        isResetting: true,
        filters: {
          type: "",
          status: "",
          search: "",
        },
      }),

    clearResettingFlag: () => set({ isResetting: false }),
  }))
);