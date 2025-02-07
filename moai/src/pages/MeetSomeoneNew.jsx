import { useState, useEffect } from "react";
import api from "../api/api"; // Axios instance for API calls
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header/Header";
import "../styles/MeetSomeoneNew.scss";

const MeetSomeoneNew = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [filters, setFilters] = useState({ language: "", religion: "", interests: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  // 🔍 Fetch a random profile based on filters and location
  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/users/meet-someone-new", { params: { ...filters } });
      setProfile(response.data);
    } catch (error) {
      console.error("❌ Error fetching profile:", error.response?.data || error);
      setProfile(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [filters]);

  // ✅ Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter((interest) => interest !== value),
    }));
  };

  // ✅ Skip profile
  const handleSkip = () => fetchProfile();

  // ✅ Send Friend Request
  const handleFriendRequest = async () => {
    try {
      await api.post("/api/friends/request", { friend_account_id: profile.account_id });
      alert("Friend request sent!");
    } catch (error) {
      console.error("❌ Error sending friend request:", error.response?.data || error);
    }
  };

  // ✅ Open/Close Message Modal
  const openMessageModal = () => setShowMessageModal(true);
  const closeMessageModal = () => setShowMessageModal(false);

  // ✅ Send a message
  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      alert("Message cannot be empty!");
      return;
    }
    try {
      await api.post("/api/messages/send", {
        receiver_account_id: profile.account_id,
        content: messageContent,
      });
      alert("Message sent!");
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
        <button
          className="meet-someone-new__filter-button"
          onClick={() => setShowFilters(true)}
          aria-label="Open filter options"
        >
          Filter Profiles
        </button>

        {showFilters && (
          <div className="meet-someone-new__filter-modal" aria-labelledby="filter-heading">
            <h2 id="filter-heading">Apply Filters</h2>
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

        {profile ? (
          <div className="meet-someone-new__profile">
            <img
              src={"Gramps.svg"}
              alt="Image upload function is not available yet. I intend to implement Cloudinary in the future."
              className="meet-someone-new__profile-picture"
            />
            <h2>
              {profile.first_name} {profile.last_name}, {profile.age} years old
            </h2>
            <p>{profile.location}</p>
            <p>{profile.languages}</p>
            <p>{profile.religion}</p>
            <div className="meet-someone-new__bio">{profile.bio}</div>
            <div className="meet-someone-new__actions">
              <button onClick={handleFriendRequest}>Add Friend</button>
              <button onClick={openMessageModal}>Send a Message</button>
              <button onClick={handleSkip}>Skip Profile</button>
            </div>
          </div>
        ) : (
          <p>No profiles available.</p>
        )}

        {showMessageModal && (
          <div className="meet-someone-new__message-modal">
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message"
            />
            <button onClick={handleSendMessage}>Send</button>
            <button onClick={closeMessageModal}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
};

export default MeetSomeoneNew;
