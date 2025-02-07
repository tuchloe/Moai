import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("userId");

    if (!token || !accountId) {
      console.warn("⚠ No token or accountId found. Redirecting to login.");
      logout();
      return;
    }

    fetchUserProfile(token, accountId);
  }, []);

  // ✅ Fetch user profile from backend
  const fetchUserProfile = async (token, accountId) => {
    token = token || localStorage.getItem("token");

    if (!token || !accountId) {
      console.error("❌ No token or accountId found. Cannot fetch profile.");
      setLoading(false);
      return;
    }

    try {
      console.log("🔍 Fetching user profile with token:", token);
      
      // ✅ Ensure API request includes the token
      const response = await api.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        console.log("✅ User profile fetched successfully.");
        setUser({ ...response.data, account_id: accountId });
      } else {
        console.warn("⚠ Unexpected response:", response);
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.warn("⚠ Unauthorized. Logging out.");
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle user login
  const login = async (token, accountId) => {
    if (!token || !accountId) {
      console.error("❌ Missing token or accountId during login.");
      return;
    }

    try {
      console.log("📝 Storing token & userId in localStorage...");
      localStorage.setItem("token", token);
      localStorage.setItem("userId", accountId);

      // ✅ Wait to ensure token is saved before making requests
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("🔄 Fetching user profile after login...");
      await fetchUserProfile(token, accountId);

      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error during login:", error.response?.data || error.message);
      logout();
    }
  };

  // ✅ Handle user logout
  const logout = async () => {
    console.warn("🔴 Logging out user...");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    setLoading(false);
    navigate("/login");
  };

  if (loading) return null; // ✅ Prevents infinite loading screen

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use AuthContext
const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
