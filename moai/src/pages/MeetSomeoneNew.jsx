import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api"; // Axios instance for API calls
import Header from "../components/Header/Header";
import AddFriendButton from "../components/AddFriend"; // ✅ Import AddFriendButton
import "../styles/MeetSomeoneNew.scss";
import grampsImage from "../assets/gramps.jpeg"; // Hardcoded profile picture

const MeetSomeoneNew = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [filters, setFilters] = useState({ language: "", religion: "", interests: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch a random profile based on filters
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found in localStorage. Cannot fetch profile.");
        return;
      }

      // ✅ Remove empty filters before sending request
      const validFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "" && value !== null)
      );

      console.log("🔍 Fetching profile with filters:", validFilters);

      const response = await api.get("/api/users/meet-someone-new", {
        headers: { Authorization: `Bearer ${token}` },
        params: validFilters,
      });

      if (response.status === 200) {
        console.log("✅ Fetched profile:", response.data);
        setProfile(response.data);
      } else {
        console.warn("⚠ Unexpected response when fetching profile:", response);
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error.response?.data || error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle interest selection
  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter((interest) => interest !== value),
    }));
  };

  // ✅ Skip current profile & fetch another
  const handleSkip = () => fetchProfile();

  // ✅ Toggle Filter Modal
  const toggleFilterModal = () => setShowFilters((prev) => !prev);

  // ✅ Apply Filters
  const applyFilters = () => {
    fetchProfile();
    toggleFilterModal();
  };

  // ✅ Toggle "Send Message" Pop-up
  const toggleMessagePopUp = () => setShowMessage((prev) => !prev);

  return (
    <>
      <Header />
      <div className="meet-someone-new">
        <div className="meet-someone-new__content">
          {/* ✅ Top Section */}
          <div className="meet-someone-new__top">
            {/* Profile Picture */}
            <img
              src={grampsImage}
              alt="Profile picture is not available yet. Image upload will be implemented in the future."
              className="meet-someone-new__picture"
            />
            {/* Introduction Box */}
            <div className="meet-someone-new__intro">
              {loading ? (
                <p>Loading profile...</p>
              ) : profile ? (
                <>
                  <h1 className="meet-someone-new__name">
                    {profile.first_name} {profile.last_name},{" "}
                    <span className="meet-someone-new__age">{profile.age} years old</span>
                  </h1>
                  <p className="meet-someone-new__location">{profile.location}</p>
                  <p className="meet-someone-new__languages">
                    {Array.isArray(profile.languages) ? profile.languages.join(", ") : profile.languages}
                  </p>
                  <p className="meet-someone-new__religion">{profile.religion}</p>
                </>
              ) : (
                <p>No profiles available.</p>
              )}
            </div>

            {/* Buttons (Add Friend & Send Message) */}
            <div className="meet-someone-new__actions">
              {profile && <AddFriendButton friendId={profile.account_id} />}
              <button className="button" onClick={toggleMessagePopUp}>
                Send a Message
              </button>
            </div>
          </div>

          {/* ✅ Divider */}
          <hr className="meet-someone-new__divider" />

          {/* ✅ Bottom Section */}
          <div className="meet-someone-new__bottom">
            {/* Interests & Bio */}
            <div className="meet-someone-new__bio-box">
              <strong>{profile?.first_name} likes:</strong>
              <p>{profile?.interests?.join(", ") || "No interests specified."}</p>
              <p className="meet-someone-new__bio-text">{profile?.bio}</p>
            </div>

            {/* Skip Profile & Apply Filters */}
            <div className="meet-someone-new__buttons">
              <button className="button meet-someone-new__button-skip" onClick={handleSkip}>
                Skip Profile
              </button>
              <button className="button meet-someone-new__button-filters" onClick={toggleFilterModal}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* 🔹 FILTER MODAL */}
        {showFilters && (
          <div className="pop-up">
            <h2>Apply Filters</h2>
            <label>
              Language:
              <input type="text" name="language" value={filters.language} onChange={handleFilterChange} />
            </label>
            <label>
              Religion:
              <input type="text" name="religion" value={filters.religion} onChange={handleFilterChange} />
            </label>
            <fieldset>
              <legend>Interests:</legend>
              {["Gardening", "Walking", "Reading", "Cooking"].map((interest) => (
                <label key={interest}>
                  <input
                    type="checkbox"
                    value={interest}
                    onChange={handleInterestChange}
                    checked={filters.interests.includes(interest)}
                  />
                  {interest}
                </label>
              ))}
            </fieldset>
            <div className="pop-up__buttons">
              <button className="button" onClick={toggleFilterModal}>Close</button>
              <button className="button" onClick={applyFilters}>Apply Filters</button>
            </div>
          </div>
        )}

        {/* 🔹 MESSAGE POP-UP */}
        {showMessage && (
          <div className="pop-up">
            <h2>Message Feature Info</h2>
            <p>
              I've implemented a simple messaging system in the back end using API calls and our database but have yet to create a front end for it.
            </p>
            <p>
              I plan to integrate a real-time API, such as socket.io, for a better experience.
            </p>
            <div className="pop-up__buttons">
              <button className="button" onClick={toggleMessagePopUp}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MeetSomeoneNew;
