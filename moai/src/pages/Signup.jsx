import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Signup.scss";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    age: "",
    interests: [],
  });

  const [errorMessage, setErrorMessage] = useState("");

  const interestOptions = [
    "Gardening", "Going for walks", "Reading", "Arts and crafts",
    "Cooking/Baking", "Dancing", "Playing music", "Travelling",
    "Sports and fitness", "Pets", "Fishing", "Bird watching",
    "Pickleball", "Golfing", "Swimming", "Knitting",
    "Woodworking", "Practicing my religion",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter((interest) => interest !== value),
    }));
  };

  // ✅ Fetch User Location from IP-API
  const getLocationFromIP = async () => {
    try {
      const response = await axios.get("http://ip-api.com/json/");
      return response.data.city || "Unknown";
    } catch (error) {
      console.error("❌ Error fetching location:", error);
      return "Unknown";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const location = await getLocationFromIP(); // ✅ Fetch user location before signup request

      const response = await axios.post("http://localhost:5000/api/auth/register", {
        ...formData,
        location,
        interests: JSON.stringify(formData.interests),
      });

      login(response.data.token, response.data.userId); // ✅ Log in user after signup
      navigate("/dashboard"); // ✅ Redirect to dashboard
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup">
      <h1 className="signup__title" tabIndex="0" aria-label="Signup Form Heading">
        Create an Account
      </h1>
      <form className="signup__form" onSubmit={handleSubmit} aria-labelledby="signup-form-heading">
        <h2 id="signup-form-heading" className="signup__heading">Signup Form</h2>
        <div className="signup__container">
          <div className="signup__left">
            <div className="signup__name-row">
              <div>
                <label htmlFor="first_name" className="signup__label">
                  First Name:
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="signup__input"
                  placeholder="First name"
                  onChange={handleChange}
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="signup__label">
                  Last Name:
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="signup__input"
                  placeholder="Last name"
                  onChange={handleChange}
                  aria-required="true"
                />
              </div>
            </div>

            <label htmlFor="age" className="signup__label">
              Age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              className="signup__input"
              placeholder="Enter age"
              onChange={handleChange}
              aria-required="true"
            />

            <label htmlFor="email" className="signup__label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="signup__input"
              placeholder="Enter email"
              onChange={handleChange}
              aria-required="true"
            />

            <label htmlFor="password" className="signup__label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="signup__input"
              placeholder="Enter password"
              onChange={handleChange}
              aria-required="true"
            />
          </div>

          <div className="signup__right">
            <fieldset className="signup__interests">
              <legend className="signup__label">Select Your Interests:</legend>
              <div className="signup__interests-grid">
                {interestOptions.map((interest) => (
                  <label key={interest} className="signup__checkbox-label">
                    <input
                      type="checkbox"
                      name="interests"
                      value={interest}
                      onChange={handleInterestChange}
                      className="signup__checkbox"
                      aria-checked={formData.interests.includes(interest)}
                    />
                    {interest}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="signup__button"
              aria-label="Sign up"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* ✅ Display Error Message */}
        {errorMessage && <p className="signup__error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Signup;
