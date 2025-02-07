import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header/Header";
import "../styles/Profile.scss";
import grampsImage from "../assets/gramps.jpeg"; // Hardcoded profile picture

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    location: "",
    languages: "",
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
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No token found in localStorage.");
          return;
        }

        console.log("🔑 Sending request with token:", token);

        const response = await fetch(`http://localhost:5000/api/users/${user.account_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error(`❌ Failed to fetch profile: ${response.status} - ${response.statusText}`);
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Received profile data:", data);

        setProfileData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          age: data.age || "",
          location: data.location || "",
          languages: data.languages || "",
          religion: data.religion || "",
          bio: data.bio || "",
          interests: Array.isArray(data.interests) 
            ? data.interests // ✅ Use it directly if already an array
            : (() => {
                try {
                  return typeof data.interests === "string" && data.interests.trim() !== ""
                    ? JSON.parse(data.interests) 
                    : [];
                } catch (parseError) {
                  console.error("❌ Error parsing interests:", parseError);
                  return [];
                }
              })(),
        });
      } catch (error) {
        console.error("❌ Error fetching profile data:", error);
      }
    };

    if (user?.account_id) fetchProfile();
  }, [user?.account_id]);

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
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found. Cannot save profile.");
        return;
      }

      console.log("✅ Saving profile with data:", profileData);

      const response = await fetch(`http://localhost:5000/api/users/${user.account_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...profileData,
          interests: JSON.stringify(profileData.interests), // ✅ Convert to string before sending
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
        interests: Array.isArray(updatedData.interests) 
          ? updatedData.interests
          : (() => {
              try {
                return typeof updatedData.interests === "string" && updatedData.interests.trim() !== ""
                  ? JSON.parse(updatedData.interests)
                  : [];
              } catch (parseError) {
                console.error("❌ Error parsing updated interests:", parseError);
                return [];
              }
            })(),
      });

      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

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
              alt="Image upload function is not available yet. I intend to implement Cloudinary in the future."
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
                  <input type="text" name="languages" value={profileData.languages} onChange={handleChange} className="profile__input" placeholder="Languages" />
                  <input type="text" name="religion" value={profileData.religion} onChange={handleChange} className="profile__input" placeholder="Religion" />
                </>
              ) : (
                <>
                  <h1 className="profile__name">{profileData.first_name} {profileData.last_name}, <span className="profile__age">{profileData.age} years old</span></h1>
                  <p className="profile__location">{profileData.location}</p>
                  <p className="profile__languages">{profileData.languages}</p>
                  <p className="profile__religion">{profileData.religion}</p>
                </>
              )}
            </div>
          </div>

          {/* ✅ Divider */}
          <hr className="profile__divider" />

          {/* ✅ Bottom Section */}
          <div className="profile__bottom">
            <button className="button profile__edit-button" onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}>
              {isEditing ? "Save" : "Edit Profile"}
            </button>

            <div className="profile__bio-box">
              <strong>{profileData.first_name} likes:</strong>
              {isEditing ? (
                <fieldset className="profile__interests">
                  <legend>Interests:</legend>
                  {interestOptions.map((interest) => (
                    <label key={interest}>
                      <input type="checkbox" value={interest} checked={profileData.interests.includes(interest)} onChange={handleInterestChange} />
                      {interest}
                    </label>
                  ))}
                </fieldset>
              ) : (
                <p>{profileData.interests.join(", ") || "No interests specified."}</p>
              )}
              {isEditing ? (
                <textarea name="bio" value={profileData.bio} onChange={handleChange} className="profile__textarea" placeholder="Write something about yourself..." />
              ) : (
                <p className="profile__bio-text">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
