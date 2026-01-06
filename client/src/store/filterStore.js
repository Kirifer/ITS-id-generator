import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../api/axiosConfig";

export const idCardFilterStore = create(
  devtools((set) => ({
    loading: false,
    error: false,
    message: "",
    data: [],

    filters: {
      type: "",
      status: "",
      search: "",
    },

    setFilter: (key, value) =>
      set((state) => ({
        filters: {
          ...state.filters,
          [key]: value,
        },
      })),

    fetchIdCards: async () => {
      set({ loading: true, error: false, message: "" });

      try {
        const { type, status, search } = idCardFilterStore.getState().filters;

        const params = {};
        if (type) params.type = type;
        if (status) params.status = status;
        if (search) params.search = search;

        const res = await axiosInstance.get("/filter/", {
          params,
          withCredentials: true,
        });
        console.log(res)
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
        filters: {
          type: "",
          status: "",
          search: "",
        },
      }),
  }))
);
