import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import "../styles/Dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();

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
            <Link
              to="/inbox"
              className="dashboard__button"
              aria-label="Go to Inbox"
              role="menuitem"
            >
              Inbox
            </Link>
            <Link
              to="/meet-someone-new"
              className="dashboard__button"
              aria-label="Meet Someone New"
              role="menuitem"
            >
              Meet Someone New
            </Link>
            <Link
              to="/settings-and-help"
              className="dashboard__button"
              aria-label="Get Help"
              role="menuitem"
            >
              Help
            </Link>

            {/* Settings and Log Out Buttons */}
            <div
              className="dashboard__split-button"
              role="group"
              aria-label="Account Actions"
            >
              <Link
                to="/settings-and-help"
                className="dashboard__split-button--top"
                aria-label="Go to Settings"
              >
                Settings
              </Link>
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
