import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header"; // ✅ Import the Header component
import "../styles/Login.scss";
import api from "../api/api"; // ✅ Axios instance for API calls

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true }); // ✅ Prevents back navigation to login
    }
  }, [navigate]);

  // ✅ Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Fetch User Location from IP-API
  const getLocationFromIP = async () => {
    try {
      const response = await api.get("http://ip-api.com/json/");
      return response.data.city || "Unknown";
    } catch (error) {
      console.error("❌ Error fetching location:", error);
      return "Unknown";
    }
  };

  // ✅ Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const location = await getLocationFromIP(); // ✅ Fetch user location before login request

      const response = await api.post("/api/auth/login", { 
        ...formData, 
        location 
      });

      const { token, user } = response.data;

      // ✅ Store authentication data
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);

      // ✅ Redirect user to dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="login">
      {/* ✅ Header Component */}
      <Header />

      <div className="login__content">
        {/* ✅ Left Section: Welcome Text */}
        <div className="login__left">
          <h2 className="login__welcome-title">Welcome to Moai!</h2>
          <p className="login__description">
            "Moai" is a concept originating from Okinawa, Japan that refers to a social group of lifelong friends that
            can provide support in social, financial, health, or spiritual interests; a fulfilling community of friends
            that grow old together.
          </p>
        </div>

        {/* ✅ Right Section: Login Form */}
        <div className="login__right">
          <form className="login__form" onSubmit={handleLogin}>
            <h3 className="login__form-title">Log In</h3>

            {/* ✅ Email Input */}
            <label htmlFor="email" className="login__label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="login__input"
              placeholder="Enter your email"
              aria-label="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />

            {/* ✅ Password Input */}
            <label htmlFor="password" className="login__label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="login__input"
              placeholder="Enter your password"
              aria-label="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />

            {/* ✅ Error Message */}
            {errorMessage && <p className="login__error">{errorMessage}</p>}

            {/* ✅ Button Container */}
            <div className="login__button-container">
              <button
                type="button"
                className="button login__signup-button"
                onClick={() => navigate("/signup")}
              >
                Create an Account
              </button>
              <button type="submit" className="button login__submit-button">
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ Footer */}
      <footer className="login__footer">
        <p className="login__footer-text">
          Moai is a social platform for seniors to meet new friends local to their area.
        </p>
      </footer>
    </div>
  );
};

export default Login;
