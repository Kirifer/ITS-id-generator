// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:5000/api",
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401s globally (optional)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      // window.location.assign('/login'); // optional redirect
    }
    return Promise.reject(err);
  }
);

export default api;

// helpers (optional)
export const setToken = (t) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");
export const getToken = () => localStorage.getItem("token");
