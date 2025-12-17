import axios from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

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
        const response = await axios.get(`${baseUrl}/id-cards/`, {
          withCredentials: true,
        });
        if (response.data) {
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
        const response = await axios.patch(`${baseUrl}/id-cards/${id}/approve`, {},{
          withCredentials: true,
        });
        if (response.data) {
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
        const response = await axios.patch(`${baseUrl}/id-cards/${id}/reject`, {},{
          withCredentials: true,
        });
        console.log(response.data)
        if (response.data) {
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
        const response = await axios.delete(`${baseUrl}/id-cards/${id}`, {
          withCredentials: true,
        });
        if (response.data) {
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

    idCardUpdate: async (credentials,id) => {
      set({
        loading: true,
        success: false,
        error: false,
        message: "",
      });

      try {
        const response = await axios.patch(`${baseUrl}/id-cards/${id}`, credentials,{
          withCredentials: true,
        });
        if (response.data) {
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

    idCardPost: async (formData) => {
      set({ loading: true, success: false, error: false, message: "" });
      try {
        const response = await axios.post(
          `${baseUrl}/id-cards`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.data) {
          set({
            loading: false,
            success: true,
            error: false,
            message: 'ID Card created successfully',
          });
        } else {
          set({
            loading: false,
            success: false,
            error: true,
            message: response.data?.message || "Creation failed",
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

    reset: () => set({ loading: false, success: false, error: false, message: "" }),
  }))
);