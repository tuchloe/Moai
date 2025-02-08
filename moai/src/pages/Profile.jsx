import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header/Header";
import "../styles/Profile.scss";
import grampsImage from "../assets/gramps.jpeg"; // Hardcoded profile picture

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showInterestsInfo, setShowInterestsInfo] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    location: "",
    languages: [],
    religion: "",
    bio: "",
    interests: [],
  });

  const interestOptions = [
    "Gardening", "Going for walks", "Reading", "Arts and crafts",
    "Cooking/Baking", "Dancing", "Playing music", "Travelling",
    "Sports and fitness", "Pets", "Fishing", "Bird watching",
    "Pickleball", "Golfing", "Swimming", "Knitting",
    "Woodworking", "Practicing my religion",
  ];

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No token found in localStorage.");
          setLoading(false);
          return;
        }

        console.log("🔍 Fetching profile for user:", user.id);

        const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error(`❌ Failed to fetch profile: ${response.status} - ${response.statusText}`);
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Profile data received:", data);

        // ✅ Ensure `languages` and `interests` are correctly formatted as arrays
        setProfileData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          age: data.age || "",
          location: data.location || "",
          languages: Array.isArray(data.languages) ? data.languages : (data.languages ? [data.languages] : []),
          religion: data.religion || "",
          bio: data.bio || "",
          interests: Array.isArray(data.interests) ? data.interests : (data.interests ? [data.interests] : []),
        });

      } catch (error) {
        console.error("❌ Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter((interest) => interest !== value),
    }));
  };

  const handleSaveProfile = async () => {
    if (!profileData) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found. Cannot save profile.");
        return;
      }

      console.log("✅ Saving profile:", profileData);

      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...profileData,
          interests: JSON.stringify(profileData.interests),
          languages: JSON.stringify(profileData.languages),
        }),
      });

      if (!response.ok) {
        console.error(`❌ Failed to update profile: ${response.status} - ${response.statusText}`);
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      const updatedData = await response.json();
      console.log("✅ Profile updated successfully!", updatedData);

      setProfileData({
        ...updatedData,
        interests: Array.isArray(updatedData.interests) ? updatedData.interests : JSON.parse(updatedData.interests || "[]"),
        languages: Array.isArray(updatedData.languages) ? updatedData.languages : JSON.parse(updatedData.languages || "[]"),
      });

      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  // ✅ Display loading message before rendering
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className="profile">
        <div className="profile__content">
          {/* ✅ Top Section */}
          <div className="profile__top">
            {/* Profile Picture */}
            <img
              src={grampsImage}
              alt="This is where I would write a caption for accessibility services. Currently, image upload is not available yet. Cloudinary will be implemented in the future."
              className="profile__picture"
            />
            {/* Introduction Box */}
            <div className="profile__intro">
              {isEditing ? (
                <>
                  <input type="text" name="first_name" value={profileData.first_name} onChange={handleChange} className="profile__input" placeholder="First Name" />
                  <input type="text" name="last_name" value={profileData.last_name} onChange={handleChange} className="profile__input" placeholder="Last Name" />
                  <input type="number" name="age" value={profileData.age} onChange={handleChange} className="profile__input" placeholder="Age" />
                  <input type="text" name="location" value={profileData.location} onChange={handleChange} className="profile__input" placeholder="Location" />
                  <input type="text" name="languages" value={profileData.languages.join(", ")} onChange={handleChange} className="profile__input" placeholder="Languages" />
                  <input type="text" name="religion" value={profileData.religion} onChange={handleChange} className="profile__input" placeholder="Religion" />
                </>
              ) : (
                <>
                  <h1 className="profile__name">{profileData.first_name} {profileData.last_name}, <span className="profile__age">{profileData.age} years old</span></h1>
                  <p className="profile__location">{profileData.location}</p>
                  <p className="profile__languages">{profileData.languages.join(", ")}</p>
                  <p className="profile__religion">{profileData.religion}</p>
                </>
              )}
            </div>
          </div>

          {/* ✅ Divider */}
          <hr className="profile__divider" />

          {/* ✅ Bottom Section */}
          <div className="profile__bottom">
            <button className="button profile__edit-button" onClick={() => setShowEditInfo(true)}>
              Edit Profile
            </button>

            <div className="profile__bio-box">
              <strong>{profileData.first_name} likes:</strong>
              <p>{profileData.interests.join(", ") || "No interests specified."}</p>
              <button className="button profile__edit-button" onClick={() => setShowInterestsInfo(true)}>
                Interests Info
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 EDIT INFO POP-UP */}
      {showEditInfo && (
        <div className="pop-up">
          <h2>Edit Profile Info</h2>
          <p>Here you can edit your profile details...</p>
          <button className="button" onClick={() => setShowEditInfo(false)}>Close</button>
        </div>
      )}
    </>
  );
};

export default Profile;
