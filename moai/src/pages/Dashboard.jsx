import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import "../styles/Dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();

  // ✅ Show pop-up for "Help" and "Settings"
  const handleHelpOrSettingsClick = () => {
    alert(
      "This part of Moai has yet to be built. I intend on making tutorial videos for FAQs and implementing a chatbot feature to help."
    );
  };

  // ✅ Show pop-up for "Inbox"
  const handleInboxClick = () => {
    alert(
      "I focused on the login authentication, IP-API, database structure/functionality, and Meet Someone feature for this project. There is a basic messaging system built in the backend using the database (for now), but I've yet to create the front end for it."
    );
  };

  return (
    <>
      <Header />
      <main className="dashboard" aria-labelledby="dashboard-heading">
        {/* Page Heading for ARIA */}
        <h1 id="dashboard-heading" className="dashboard__heading">
          Welcome to Your Dashboard
        </h1>
        <div className="dashboard__content">
          {/* Main Button Grid */}
          <div className="dashboard__grid" role="menu" aria-label="Main Menu">
            {/* Use Link components for better accessibility */}
            <Link
              to="/friends"
              className="dashboard__button"
              aria-label="Go to My Friends"
              role="menuitem"
            >
              Friends
            </Link>
            <Link
              to="/profile"
              className="dashboard__button"
              aria-label="Go to Profile"
              role="menuitem"
            >
              Profile
            </Link>
            <button
              className="dashboard__button"
              aria-label="Go to Inbox"
              role="menuitem"
              onClick={handleInboxClick}
            >
              Inbox
            </button>
            <Link
              to="/meet-someone-new"
              className="dashboard__button"
              aria-label="Meet Someone New"
              role="menuitem"
            >
              Meet Someone New
            </Link>
            <button
              className="dashboard__button"
              aria-label="Get Help"
              role="menuitem"
              onClick={handleHelpOrSettingsClick}
            >
              Help
            </button>

            {/* Settings and Log Out Buttons */}
            <div
              className="dashboard__split-button"
              role="group"
              aria-label="Account Actions"
            >
              <button
                className="dashboard__split-button--top"
                aria-label="Go to Settings"
                onClick={handleHelpOrSettingsClick}
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
    </>
  );
};

export default Dashboard;
