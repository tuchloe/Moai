import { useState, useEffect } from "react";
import api from "../api/api"; // Axios instance for API calls
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header/Header";
import AddFriendButton from "../components/AddFriend"; // ✅ Import AddFriendButton
import "../styles/MeetSomeoneNew.scss";

const MeetSomeoneNew = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [filters, setFilters] = useState({ language: "", religion: "", interests: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Added loading state

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

  // ✅ Open/Close Message Modal
  const openMessageModal = () => setShowMessageModal(true);
  const closeMessageModal = () => setShowMessageModal(false);

  // ✅ Send a message
  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      alert("⚠ Message cannot be empty!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found. Cannot send message.");
        return;
      }

      await api.post("/api/messages/send", {
        receiver_account_id: profile.account_id,
        content: messageContent,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Message sent!");
      setMessageContent("");
      closeMessageModal();
    } catch (error) {
      console.error("❌ Error sending message:", error.response?.data || error);
    }
  };

  return (
    <>
      <Header />
      <div className="meet-someone-new">
        {/* 🔹 FILTER BUTTON */}
        <button className="meet-someone-new__filter-button" onClick={() => setShowFilters(true)}>
          Filter Profiles
        </button>

        {/* 🔹 FILTER MODAL */}
        {showFilters && (
          <div className="meet-someone-new__filter-modal">
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
            <button onClick={() => setShowFilters(false)}>Close</button>
            <button onClick={fetchProfile}>Apply Filters</button>
          </div>
        )}

        {/* 🔹 PROFILE DISPLAY */}
        {loading ? (
          <p>Loading profile...</p>
        ) : profile ? (
          <div className="meet-someone-new__profile">
            <img
              src={"Gramps.svg"}
              alt="Profile picture is not available yet. Image upload will be implemented in the future."
              className="meet-someone-new__profile-picture"
            />
            <h2>{profile.first_name} {profile.last_name}, {profile.age} years old</h2>
            <p>{profile.location}</p>
            <p>{profile.languages}</p>
            <p>{profile.religion}</p>
            <div className="meet-someone-new__bio">{profile.bio}</div>
            <div className="meet-someone-new__actions">
              <AddFriendButton friendId={profile.account_id} />
              <button onClick={openMessageModal}>Send a Message</button>
              <button onClick={handleSkip}>Skip Profile</button>
            </div>
          </div>
        ) : (
          <p>No profiles available.</p>
        )}

        {/* 🔹 MESSAGE MODAL */}
        {showMessageModal && (
          <div className="meet-someone-new__message-modal">
            <textarea value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="Type your message" />
            <button onClick={handleSendMessage}>Send</button>
            <button onClick={closeMessageModal}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
};

export default MeetSomeoneNew;
