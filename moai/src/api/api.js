import axios from "axios";

// ✅ Use environment variable, fallback to localhost if undefined
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL, // ✅ Uses VITE_API_BASE_URL or fallback
  headers: {
    "Content-Type": "application/json", // Ensure all requests use JSON
  },
});

// ✅ Automatically attach the Authorization token (if available)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach the token to Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error) // Reject promise on error
);

export default api;
