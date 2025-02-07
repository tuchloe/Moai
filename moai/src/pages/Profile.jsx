import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header/Header";
import "../styles/Profile.scss";
import grampsImage from "../assets/gramps.jpeg"; // Hardcoded profile picture

const Profile = () => {
  const { user } = useAuth(); // Get the logged-in user's account_id
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    location: "",
    languages: "",
    bio: "",
    interests: [],
  });

  // Fetch profile data from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${user.account_id}`);
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (user?.account_id) {
      fetchProfile();
    }
  }, [user?.account_id]);

  // Handle input changes
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Handle interests separately (comma-separated values)
  const handleInterestsChange = (e) => {
    setProfileData({ ...profileData, interests: e.target.value.split(",") });
  };

  // Handle form submission (save updates)
  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.account_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setIsEditing(false); // Exit edit mode
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <Header /> {/* Header stays outside the profile class */}
      <div className="profile">
        <div className="profile__content">
          {/* Top Section */}
          <div className="profile__top">
            {/* Profile Picture */}
            <img
              src={grampsImage} // Hardcoded profile picture from assets folder
              alt="Image upload function is not available yet. I intend to implement Cloudinary in the future."
              className="profile__picture"
            />
            <div className="profile__info">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="first_name"
                    value={profileData.first_name}
                    onChange={handleChange}
                    className="profile__input"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={profileData.last_name}
                    onChange={handleChange}
                    className="profile__input"
                    placeholder="Last Name"
                  />
                  <input
                    type="number"
                    name="age"
                    value={profileData.age}
                    onChange={handleChange}
                    className="profile__input"
                    placeholder="Age"
                  />
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    className="profile__input"
                    placeholder="Location"
                  />
                  <input
                    type="text"
                    name="languages"
                    value={profileData.languages}
                    onChange={handleChange}
                    className="profile__input"
                    placeholder="Languages"
                  />
                </>
              ) : (
                <>
                  <h1 className="profile__name">
                    {profileData.first_name} {profileData.last_name},{" "}
                    <span className="profile__age">{profileData.age} years old</span>
                  </h1>
                  <p className="profile__location">{profileData.location}</p>
                  <p className="profile__languages">Speaks: {profileData.languages}</p>
                </>
              )}
            </div>
          </div>

          {/* Divider */}
          <hr className="profile__divider" />

          {/* Bottom Section */}
          <div className="profile__bottom">
            <button
              className="button profile__edit-button"
              onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
              aria-label={isEditing ? "Save your profile" : "Edit your profile"}
            >
              {isEditing ? "Save" : "Edit Profile"}
            </button>

            {/* Bio Section */}
            <div className="profile__bio">
              <strong className="profile__bio-header">
                {profileData.first_name} likes:
              </strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="interests"
                  value={profileData.interests.join(", ")}
                  onChange={handleInterestsChange}
                  className="profile__input"
                  placeholder="Interests (comma-separated)"
                />
              ) : (
                profileData.interests.length > 0
                  ? profileData.interests.join(", ")
                  : "No interests specified."
              )}
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  className="profile__textarea"
                  placeholder="Write something about yourself..."
                />
              ) : (
                <p className="profile__bio-text">{profileData.bio}</p>
              )}
            </div>

            {/* Gallery */}
            <div className="profile__gallery">
              <img
                src="https://via.placeholder.com/200x150" // Hardcoded gallery image
                alt="Gallery"
                className="profile__gallery-image"
              />
              <p className="profile__gallery-text">Gallery</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
