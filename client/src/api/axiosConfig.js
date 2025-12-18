import axios from "axios";
import { loginStore, authCheckStore, refreshStore, logoutStore } from "../store/authStore";

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

let navigate;
export const setNavigate = (nav) => {
  navigate = nav;
};

export const setupInterceptors = () => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url?.includes("/auth/")) {
          loginStore.getState().reset();
          authCheckStore.getState().reset();
          refreshStore.getState().reset();
          logoutStore.getState().reset();
          if (navigate) navigate("/login");
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => axiosInstance(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await refreshStore.getState().refreshToken();
          const refreshState = refreshStore.getState();

          if (refreshState.success) {
            processQueue(null);
            return axiosInstance(originalRequest);
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (refreshError) {
          processQueue(refreshError);
          loginStore.getState().reset();
          authCheckStore.getState().reset();
          refreshStore.getState().reset();
          logoutStore.getState().reset();
 

          if (navigate) navigate("/login");

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (error.response?.status === 401) {
        loginStore.getState().reset();
        authCheckStore.getState().reset();
        refreshStore.getState().reset();
        logoutStore.getState().reset();


        if (navigate) navigate("/login");
      }

      return Promise.reject(error);
    }
  );
};
