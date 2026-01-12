import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../api/axiosConfig";


export const useGetAllAdminsStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",
    admins: [],

    getAllAdmins: async () => {
      set({ loading: true, success: false, error: false, message: "" });
      try {
        const response = await axiosInstance.get("/admin", {
          withCredentials: true,
        });

        if (response.data?.success) {
          set({
            loading: false,
            success: true,
            error: false,
            message: "Admins fetched successfully",
            admins: response.data.data,
          });
        } else {
          set({
            loading: false,
            success: false,
            error: true,
            message: response.data?.message || "Failed to fetch admins",
            admins: [],
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.message || "Something went wrong",
          admins: [],
        });
      }
    },

    reset: () =>
      set({
        loading: false,
        success: false,
        error: false,
        message: "",
        admins: [],
      }),
  }))
);

export const useGetAdminByIdStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",
    admin: null,

    getAdminById: async (id) => {
      set({ loading: true, success: false, error: false, message: "" });
      try {
        const response = await axiosInstance.get(`/admin/${id}`, {
          withCredentials: true,
        });

        if (response.data?.success) {
          set({
            loading: false,
            success: true,
            error: false,
            message: "Admin fetched successfully",
            admin: response.data.data,
          });
        } else {
          set({
            loading: false,
            success: false,
            error: true,
            message: response.data?.message || "Failed to fetch admin",
            admin: null,
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.message || "Something went wrong",
          admin: null,
        });
      }
    },

    reset: () =>
      set({
        loading: false,
        success: false,
        error: false,
        message: "",
        admin: null,
      }),
  }))
);

export const useCreateAdminStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",
    errors: {},

    createAdmin: async (adminData) => {
      set({ loading: true, success: false, error: false, message: "", errors: {} });
      try {
        const response = await axiosInstance.post("/admin", adminData, {
          withCredentials: true,
        });

        if (response.data?.success) {
          set({
            loading: false,
            success: true,
            error: false,
            message: response.data.message || "Admin created successfully",
            errors: {},
          });
        } else {
          set({
            loading: false,
            success: false,
            error: true,
            message: response.data?.message || "Failed to create admin",
            errors: response.data?.errors || {},
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.message || "Something went wrong",
          errors: err.response?.data?.errors || {},
        });
      }
    },

    reset: () =>
      set({
        loading: false,
        success: false,
        error: false,
        message: "",
        errors: {},
      }),
  }))
);

export const useUpdateAdminStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",
    errors: {},

    updateAdmin: async (id, adminData) => {
      set({ loading: true, success: false, error: false, message: "", errors: {} });
      try {
        const response = await axiosInstance.patch(`/admin/${id}`, adminData, {
          withCredentials: true,
        });

        if (response.data?.success) {
          set({
            loading: false,
            success: true,
            error: false,
            message: response.data.message || "Admin updated successfully",
            errors: {},
          });
        } else {
          set({
            loading: false,
            success: false,
            error: true,
            message: response.data?.message || "Failed to update admin",
            errors: response.data?.errors || {},
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.message || "Something went wrong",
          errors: err.response?.data?.errors || {},
        });
      }
    },

    reset: () =>
      set({
        loading: false,
        success: false,
        error: false,
        message: "",
        errors: {},
      }),
  }))
);

export const useDeleteAdminStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",

    deleteAdmin: async (id) => {
      set({ loading: true, success: false, error: false, message: "" });
      try {
        const response = await axiosInstance.delete(`/admin/${id}`, {
          withCredentials: true,
        });

        if (response.data?.success) {
          set({
            loading: false,
            success: true,
            error: false,
            message: response.data.message || "Admin deleted successfully",
          });
        } else {
          set({
            loading: false,
            success: false,
            error: true,
            message: response.data?.message || "Failed to delete admin",
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

export const useFilterAdminStore = create(
  devtools((set) => ({
    loading: false,
    admins: [],
    error: false,
    message: "",

    filterAdmins: async (search = "", isActive) => {
      set({ loading: true, admins: [], error: false, message: "" });
      try {
        const params = {};
        if (search) params.search = search;
        if (isActive !== undefined) params.isActive = isActive;

        const response = await axiosInstance.get("/admin/filter", {
          params,
          withCredentials: true,
        });

        if (response.data?.success) {
          set({
            loading: false,
            admins: response.data.data || [],
            error: false,
            message: "",
          });
        } else {
          set({
            loading: false,
            admins: [],
            error: true,
            message: response.data?.message || "Failed to fetch admins",
          });
        }
      } catch (err) {
        set({
          loading: false,
          admins: [],
          error: true,
          message: err.response?.data?.message || "Something went wrong",
        });
      }
    },

    reset: () => set({ loading: false, admins: [], error: false, message: "" }),
  }))
);