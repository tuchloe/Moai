import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import api from "../api/api"; // ✅ Import API instance
import "../styles/Dashboard.scss";
import { useAuth } from "../context/AuthContext"; // ✅ Import authentication context

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Get logged-in user data

  // ✅ Pop-up states
  const [showFriends, setShowFriends] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [friendsList, setFriendsList] = useState([]);

  // ✅ Fetch & Show Friends List
  const handleFriendsClick = async () => {
    if (!user) {
      alert("You must be logged in to view friends.");
      return;
    }

    try {
      const response = await api.get(`/api/friends/${user.id}`);
      setFriendsList(response.data);

      if (response.data.length === 0) {
        alert("You currently have no friends added.");
        return;
      }

      setShowFriends(true); // ✅ Open pop-up modal
    } catch (error) {
      console.error("❌ Error fetching friends list:", error.response?.data || error.message);
      alert("Failed to fetch friends. Please try again later.");
    }
  };

  // ✅ Show pop-up for "Help"
  const handleHelpClick = () => {
    setShowHelp(true);
  };

  // ✅ Show pop-up for "Inbox"
  const handleInboxClick = () => {
    setShowInbox(true);
  };

  return (
    <>
      <Header />
      <main className="dashboard" aria-labelledby="dashboard-heading">
        <h1 id="dashboard-heading" className="dashboard__heading">
          Welcome to Your Dashboard
        </h1>
        <div className="dashboard__content">
          <div className="dashboard__grid" role="menu" aria-label="Main Menu">
            <button
              className="dashboard__button"
              aria-label="Go to My Friends"
              role="menuitem"
              onClick={handleFriendsClick}
            >
              Friends
            </button>
            <button
              className="dashboard__button"
              aria-label="Go to Profile"
              role="menuitem"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            <button
              className="dashboard__button"
              aria-label="Go to Inbox"
              role="menuitem"
              onClick={handleInboxClick}
            >
              Inbox
            </button>
            <button
              className="dashboard__button"
              aria-label="Meet Someone New"
              role="menuitem"
              onClick={() => navigate("/meet-someone-new")}
            >
              Meet Someone New
            </button>
            <button
              className="dashboard__button"
              aria-label="Get Help"
              role="menuitem"
              onClick={handleHelpClick}
            >
              Help
            </button>

            <div
              className="dashboard__split-button"
              role="group"
              aria-label="Account Actions"
            >
              <button
                className="dashboard__split-button--top"
                aria-label="Go to Settings"
                onClick={handleHelpClick}
              >
                Settings
              </button>
              <button
                className="dashboard__split-button--bottom"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
                aria-label="Log Out"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 🔹 FRIENDS LIST POP-UP */}
      {showFriends && (
        <div className="pop-up">
          <h2>Your Friends</h2>
          {friendsList.length > 0 ? (
            <ul>
              {friendsList.map((friend) => (
                <li key={friend.id}>
                  {friend.first_name} {friend.last_name}
                </li>
              ))}
            </ul>
          ) : (
            <p>You currently have no friends added.</p>
          )}
          <button className="button" onClick={() => setShowFriends(false)}>
            Close
          </button>
        </div>
      )}

      {/* 🔹 HELP POP-UP */}
      {showHelp && (
        <div className="pop-up">
          <h2>Help & Settings</h2>
          <p>
            This part of Moai has yet to be built. I intend on making tutorial videos for FAQs and implementing a chatbot feature to help.
          </p>
          <button className="button" onClick={() => setShowHelp(false)}>
            Close
          </button>
        </div>
      )}

      {/* 🔹 INBOX POP-UP */}
      {showInbox && (
        <div className="pop-up">
          <h2>Inbox Feature</h2>
          <p>
            I focused on the login authentication, IP-API, database structure/functionality, and Meet Someone feature for this project.
          </p>
          <p>
            There is a basic messaging system built in the backend using the database (for now), but I've yet to create the front end for it.
          </p>
          <button className="button" onClick={() => setShowInbox(false)}>
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Dashboard;
