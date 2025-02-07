import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/api";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("⚠ No token found in localStorage. Redirecting to login.");
      logout();
      return;
    }

    fetchUserProfile(token); // Fetch profile if token exists
  }, []);

  // ✅ Fetch and update user location using IP API
  const updateLocation = async (accountId) => {
    try {
      const response = await axios.get("http://ip-api.com/json");
      if (response.data.city) {
        await api.post("/api/location/update", {
          accountId,
          city: response.data.city,
        });
      }
    } catch (error) {
      console.error("❌ Error updating location:", error);
    }
  };

  // ✅ Fetch user profile from backend
  const fetchUserProfile = async (token) => {
    if (!token) {
      console.error("❌ No token found. Cannot fetch profile.");
      logout();
      return;
    }

    try {
      const response = await api.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setUser(response.data); // Ensure the response includes account_id
      } else {
        console.warn("⚠ Unexpected response when fetching profile:", response);
        logout();
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error.response?.data || error.message);
      
      // If 401 (Unauthorized), force logout
      if (error.response?.status === 401) {
        console.warn("⚠ Unauthorized. Logging out.");
        logout();
      }
    }
  };

  // ✅ Handle user login
  const login = async (token, accountId) => {
    if (!token || !accountId) {
      console.error("❌ Missing token or accountId during login.");
      return;
    }

    try {
      localStorage.setItem("token", token);

      // Fetch and set user profile
      const profileResponse = await api.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({ token, account_id: accountId, ...profileResponse.data });

      // Update location in the backend
      updateLocation(accountId);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error during login:", error.response?.data || error.message);
      logout();
    }
  };

  // ✅ Handle user logout
  const logout = () => {
    console.warn("🔴 Logging out user...");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use AuthContext
const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
