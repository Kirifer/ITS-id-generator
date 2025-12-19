import axios from "axios";
import { loginStore, authCheckStore, refreshStore, logoutStore } from "../store/authStore";

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];
let navigate;

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

export const setNavigate = (nav) => { navigate = nav; };

export const setupInterceptors = () => {
  if (axiosInstance.interceptors.response.handlers.length > 0) return;

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const isAuthRequest = originalRequest.url?.includes("/auth/");

      if (error.response?.status === 401) {
        if (originalRequest._retry || isAuthRequest) {
          loginStore.getState().reset();
          authCheckStore.getState().reset();
          if (navigate && !originalRequest.url?.includes("/auth/check")) {
            navigate("/login");
          }
          return Promise.reject(error);
        }
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => axiosInstance(originalRequest)).catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await refreshStore.getState().refreshToken();
          if (refreshStore.getState().success) {
            processQueue(null);
            return axiosInstance(originalRequest);
          }
          throw new Error("Refresh failed");
        } catch (refreshError) {
          processQueue(refreshError);
          if (navigate) navigate("/login");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );
};