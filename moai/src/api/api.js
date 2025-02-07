import axios from "axios";

// ✅ Use environment variable, fallback to localhost if undefined
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach the Authorization token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("🔑 Attaching token to request:", token); // Debugging log
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠ No token found in localStorage when making request");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
