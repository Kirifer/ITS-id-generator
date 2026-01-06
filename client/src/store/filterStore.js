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

    filters: {
      type: "",
      status: "",
      search: "",
    },

    setFilter: (key, value) => {
      console.log(`[STORE] setFilter called: ${key} = ${value}`);
      set((state) => ({
        filters: {
          ...state.filters,
          [key]: value,
        },
      }));
    },

    fetchIdCards: async () => {
      console.log("[STORE] fetchIdCards CALLED");
      set({ loading: true, error: false, message: "", initialized: true });

      try {
        const { type, status, search } = get().filters;

        const params = {};
        if (type) params.type = type;
        if (status) params.status = status;
        if (search) params.search = search;

        console.log("[STORE] Fetching with params:", params);
        const res = await axiosInstance.get("/filter/", {
          params,
          withCredentials: true,
        });
        console.log("[STORE] Fetch response:", res);
        set({
          loading: false,
          data: res.data,
        });
      } catch (err) {
        console.error("[STORE] Fetch error:", err);
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