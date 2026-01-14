import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../api/axiosConfig";

export const getPositionsStore = create(
  devtools((set) => ({
    positions: [],
    loading: false,
    success: false,
    error: false,
    message: "",

    getPositions: async () => {
      set({ loading: true, success: false, error: false, message: "" });
      try {
        const response = await axiosInstance.get("/position", {
          withCredentials: true,
        });

        if (response.data?.success) {
          set({
            positions: response.data.data,
            loading: false,
            success: true,
            error: false,
            message: "Positions fetched successfully",
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.message || "Failed to fetch positions",
        });
      }
    },

    reset: () =>
      set({
        positions: [],
        loading: false,
        success: false,
        error: false,
        message: "",
      }),
  }))
);

export const getAllPositionsStore = create(
  devtools((set) => ({
    allPositions: [],
    loading: false,
    success: false,
    error: false,
    message: "",

    getAllPositions: async () => {
      set({ loading: true, success: false, error: false, message: "" });
      try {
        const response = await axiosInstance.get("/position/all", {
          withCredentials: true,
        });

        if (response.data?.success) {
          set({
            allPositions: response.data.data,
            loading: false,
            success: true,
            error: false,
            message: "All positions fetched successfully",
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.message || "Failed to fetch all positions",
        });
      }
    },

    reset: () =>
      set({
        allPositions: [],
        loading: false,
        success: false,
        error: false,
        message: "",
      }),
  }))
);

export const createPositionStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",

    createPosition: async (positionData) => {
      set({ loading: true, success: false, error: false, message: "" });
      try {
        const response = await axiosInstance.post("/position", positionData, {
          withCredentials: true,
        });

        if (response.data?.success) {
          set({
            loading: false,
            success: true,
            error: false,
            message: response.data.message || "Position created successfully",
          });
          
          return response.data.data;
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to create position";
        const errors = err.response?.data?.errors;
        
        set({
          loading: false,
          success: false,
          error: true,
          message: errors ? Object.values(errors).join(", ") : errorMessage,
        });
        
        throw err;
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

export const patchPositionStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",

    patchPosition: async (id, updateData) => {
      set({ loading: true, success: false, error: false, message: "" });
      try {
        const response = await axiosInstance.patch(`/position/${id}`, updateData, {
          withCredentials: true,
        });

        if (response.data?.success) {
          set({
            loading: false,
            success: true,
            error: false,
            message: response.data.message || "Position updated successfully",
          });
          
          return response.data.data;
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to update position";
        const errors = err.response?.data?.errors;
        
        set({
          loading: false,
          success: false,
          error: true,
          message: errors ? Object.values(errors).join(", ") : errorMessage,
        });
        
        throw err;
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

export const deletePositionStore = create(
  devtools((set) => ({
    loading: false,
    success: false,
    error: false,
    message: "",

    deletePosition: async (id) => {
      set({ loading: true, success: false, error: false, message: "" });
      try {
        const response = await axiosInstance.delete(`/position/${id}`, {
          withCredentials: true,
        });

        if (response.data?.success) {
          set({
            loading: false,
            success: true,
            error: false,
            message: response.data.message || "Position deleted successfully",
          });
        }
      } catch (err) {
        set({
          loading: false,
          success: false,
          error: true,
          message: err.response?.data?.message || "Failed to delete position",
        });
        
        throw err;
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