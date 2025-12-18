import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../api/axiosConfig";

export const idCardStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",
    items: [],

    getIdCards: async () => {
      set({
        loading: true,
        success: false,
        error: false,
        message: "",
        items: [],
      });

      try {
        const response = await axiosInstance.get("/id-cards/", {
          withCredentials: true,
        });
        console.log(response.data)
        if (response.status === 200 && response.data) {
          set({
            loading: false,
            success: true,
            error: false,
            message: "ID Cards fetched successfully",
            items: response.data,
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.error || "Failed to fetch ID cards",
        });
      }
    },

    reset: () =>
      set({
        loading: false,
        success: false,
        error: false,
        message: "",
        items: [],
      }),
  }))
);

export const idCardApproveStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",
    items: [],

    idCardApprove: async (id) => {
      set({
        loading: true,
        success: false,
        error: false,
        message: "",
      });

      try {
        const response = await axiosInstance.patch(
          `/id-cards/${id}/approve`,
          {},
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 && response.data) {
          set({
            loading: false,
            success: true,
            error: false,
            message: "User Approved",
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.error || "Failed Approve User",
        });
      }
    },

    reset: () =>
      set({
        loading: false,
        success: false,
        error: false,
        message: "",
      }),
  }))
);

export const idCardRejectStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",

    idCardReject: async (id) => {
      set({
        loading: true,
        success: false,
        error: false,
        message: "",
      });

      try {
        const response = await axiosInstance.patch(
          `/id-cards/${id}/reject`,
          {},
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 && response.data) {
          set({
            loading: false,
            success: true,
            error: false,
            message: "User Rejected",
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.error || "Failed to Reject User",
        });
      }
    },

    reset: () =>
      set({
        loading: false,
        success: false,
        error: false,
        message: "",
      }),
  }))
);

export const idCardDeleteStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",
    items: [],

    idCardDelete: async (id) => {
      set({
        loading: true,
        success: false,
        error: false,
        message: "",
      });

      try {
        const response = await axiosInstance.delete(`/id-cards/${id}`, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data) {
          set({
            loading: false,
            success: true,
            error: false,
            message: "User Deleted",
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.error || "Failed to Delete User",
        });
      }
    },

    reset: () =>
      set({
        loading: false,
        success: false,
        error: false,
        message: "",
      }),
  }))
);

export const idCardUpdateStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",
    items: [],

    idCardUpdate: async (formData, id) => {
      set({
        loading: true,
        success: false,
        error: false,
        message: "",
      });

      try {
        const response = await axiosInstance.patch(
          `/id-cards/${id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        if (response.status === 200 && response.data) {
          set({
            loading: false,
            success: true,
            error: false,
            message: "User Updated",
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.error || "Failed to Update User",
        });
      }
    },

    reset: () =>
      set({
        loading: false,
        success: false,
        error: false,
        message: "",
      }),
  }))
);

export const idCardPostStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",
    idCardData: null,

    idCardPost: async (formData) => {
      set({
        loading: true,
        success: false,
        error: false,
        message: "",
        idCardData: null,
      });

      try {
        const response = await axiosInstance.post(`/id-cards`, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 201) {
          set({
            loading: false,
            success: true,
            error: false,
            message: "ID Card created successfully",
            idCardData: response.data,
          });
          return true;
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message:
            err.response?.data?.message ||
            err.message ||
            "Something went wrong",
          idCardData: null,
        });
        return false;
      }
    },

    reset: () =>
      set({
        loading: false,
        success: false,
        error: false,
        message: "",
        idCardData: null,
      }),
  }))
);