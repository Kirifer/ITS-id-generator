import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../api/axiosConfig";

export const hrStore = create(
  devtools((set) => ({
    /* =====================
       STATE
    ===================== */
    loading: false,
    success: false,
    error: false,
    message: "",

    hrList: [],
    selectedHr: null,

    /* =====================
       ACTIONS
    ===================== */

    setSelectedHr: (hr) => set({ selectedHr: hr }),

    /* =====================
       GET ALL HR
    ===================== */
    getHrList: async () => {
      set({ loading: true, success: false, error: false, message: "" });

      try {
        const res = await axiosInstance.get("/hr", {
          withCredentials: true,
        });

        if (res.data?.success) {
          set({
            loading: false,
            success: true,
            hrList: res.data.data || [],
          });
        } else {
          set({
            loading: false,
            error: true,
            message: res.data?.error || "Failed to fetch HR list",
          });
        }
      } catch (err) {
        set({
          loading: false,
          error: true,
          message: err.response?.data?.error || "Something went wrong",
        });
      }
    },

    /* =====================
       CREATE HR
    ===================== */
    createHr: async (formData) => {
      set({ loading: true, success: false, error: false, message: "" });

      try {
        const res = await axiosInstance.post("/hr", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.success) {
          set((state) => ({
            loading: false,
            success: true,
            hrList: [...state.hrList, res.data.data],
          }));
        } else {
          set({
            loading: false,
            error: true,
            message: res.data?.error || "Failed to create HR",
          });
        }
      } catch (err) {
        set({
          loading: false,
          error: true,
          message: err.response?.data?.error || "Something went wrong",
        });
      }
    },

    /* =====================
       UPDATE HR
    ===================== */
    updateHr: async (id, formData) => {
      set({ loading: true, success: false, error: false, message: "" });

      try {
        const res = await axiosInstance.patch(`/hr/${id}`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.success) {
          set((state) => ({
            loading: false,
            success: true,
            hrList: state.hrList.map((hr) =>
              hr._id === id ? res.data.data : hr
            ),
            selectedHr: res.data.data,
          }));
        } else {
          set({
            loading: false,
            error: true,
            message: res.data?.error || "Failed to update HR",
          });
        }
      } catch (err) {
        set({
          loading: false,
          error: true,
          message: err.response?.data?.error || "Something went wrong",
        });
      }
    },

    /* =====================
       DELETE HR  ✅ STORE HANDLES IT
    ===================== */
    deleteHr: async (id) => {
      set({ loading: true, success: false, error: false, message: "" });

      try {
        const res = await axiosInstance.delete(`/hr/${id}`, {
          withCredentials: true,
        });

        if (res.data?.success) {
          set((state) => ({
            loading: false,
            success: true,
            hrList: state.hrList.filter((hr) => hr._id !== id),
            selectedHr: null,
            message: "HR deleted successfully",
          }));
        } else {
          set({
            loading: false,
            error: true,
            message: res.data?.error || "Failed to delete HR",
          });
        }
      } catch (err) {
        set({
          loading: false,
          error: true,
          message: err.response?.data?.error || "Something went wrong",
        });
      }
    },

    /* =====================
       RESET
    ===================== */
    reset: () =>
      set({
        loading: false,
        success: false,
        error: false,
        message: "",
        selectedHr: null,
      }),
  }))
);
