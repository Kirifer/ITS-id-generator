// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend server URL
  withCredentials: true, // if you’re using cookies
});

export default api;
