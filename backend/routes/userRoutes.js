const express = require("express");
const db = require("../database/database");
const verifyToken = require("../middleware/authMiddleware"); // ✅ Middleware for protected routes

const router = express.Router();

/* ✅ GET Random Local User with Filters */
router.get("/meet-someone-new", verifyToken, async (req, res) => {
  try {
    const { account_id } = req.user;
    const { language, religion, interests } = req.query;

    console.log("🔍 Fetching random user for:", { language, religion, interests });

    // 🔍 Get current user's location
    const [currentUser] = await db.query("SELECT location FROM Users WHERE account_id = ?", [account_id]);
    if (!currentUser.length) {
      console.error("❌ Current user not found in database:", account_id);
      return res.status(404).json({ error: "User not found" });
    }

    const location = currentUser[0].location;
    let query = `SELECT * FROM Users WHERE location = ? AND account_id != ?`;
    let queryParams = [location, account_id];

    if (language) {
      query += " AND FIND_IN_SET(?, languages)";
      queryParams.push(language);
    }

    if (religion) {
      query += " AND religion = ?";
      queryParams.push(religion);
    }

    if (interests) {
      try {
        const interestArray = JSON.parse(interests);
        if (Array.isArray(interestArray) && interestArray.length > 0) {
          query += ` AND JSON_OVERLAPS(interests, ?)`;
          queryParams.push(JSON.stringify(interestArray));
        }
      } catch (parseError) {
        console.error("❌ Error parsing interests filter:", parseError);
      }
    }

    query += " ORDER BY RAND() LIMIT 1";

    const [users] = await db.query(query, queryParams);

    if (!users.length) {
      console.warn("⚠ No matches found. Returning any available user.");
      const [fallbackUsers] = await db.query(
        `SELECT * FROM Users WHERE account_id != ? ORDER BY RAND() LIMIT 1`,
        [account_id]
      );
      if (!fallbackUsers.length) return res.status(404).json({ message: "No profiles available." });
      return res.json(fallbackUsers[0]);
    }

    console.log("✅ Found a matching user:", users[0]);
    res.json(users[0]);
  } catch (error) {
    console.error("❌ Error fetching random user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ✅ GET User Profile */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    console.log("🟢 Fetching Profile for User ID:", req.params.id);

    const [users] = await db.query(
      `SELECT first_name, last_name, age, location, languages, interests, bio, religion 
       FROM Users WHERE account_id = ?`,
      [req.params.id]
    );

    if (users.length === 0) {
      console.error("❌ User not found:", req.params.id);
      return res.status(404).json({ error: "User not found" });
    }

    let user = users[0];

    // ✅ Parse JSON fields (Interests & Languages)
    try {
      user.interests = user.interests ? JSON.parse(user.interests) : [];
      user.languages = user.languages ? JSON.parse(user.languages) : [];
    } catch (parseError) {
      console.error("❌ Error parsing JSON fields:", parseError);
      user.interests = [];
      user.languages = [];
    }

    console.log("✅ User profile retrieved:", user);
    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ✅ UPDATE User Profile */
router.put("/:id", verifyToken, async (req, res) => {
  const { first_name, last_name, age, location, languages, interests, bio, religion } = req.body;

  try {
    console.log("📝 Updating profile for user:", req.params.id);

    await db.query(
      `UPDATE Users 
       SET first_name = ?, last_name = ?, age = ?, location = ?, languages = ?, interests = ?, bio = ?, religion = ?
       WHERE account_id = ?`,
      [
        first_name,
        last_name,
        age,
        location,
        JSON.stringify(languages || []), // ✅ Store JSON string safely
        JSON.stringify(interests || []), // ✅ Store JSON string safely
        bio,
        religion,
        req.params.id,
      ]
    );

    res.json({ message: "✅ Profile updated successfully" });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ✅ SEND Friend Request */
router.post("/friend-request", verifyToken, async (req, res) => {
  try {
    const { account_id } = req.user;
    const { friend_account_id } = req.body;

    // 🔍 Check if friend exists
    const [friend] = await db.query("SELECT account_id FROM Users WHERE account_id = ?", [friend_account_id]);
    if (!friend.length) {
      console.error("❌ Friend not found:", friend_account_id);
      return res.status(404).json({ error: "User not found" });
    }

    // ❌ Prevent duplicate requests
    const [existingRequest] = await db.query(
      "SELECT * FROM Friends WHERE (user_account_id = ? AND friend_account_id = ?) OR (user_account_id = ? AND friend_account_id = ?)",
      [account_id, friend_account_id, friend_account_id, account_id]
    );

    if (existingRequest.length > 0) {
      console.warn("⚠ Friend request already exists between:", account_id, friend_account_id);
      return res.status(400).json({ error: "Friend request already sent or accepted." });
    }

    // ✅ Insert new friend request
    await db.query("INSERT INTO Friends (user_account_id, friend_account_id, status) VALUES (?, ?, 'Pending')", [account_id, friend_account_id]);

    res.json({ message: "✅ Friend request sent!" });
  } catch (error) {
    console.error("❌ Error sending friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ✅ SEND Message */
router.post("/send-message", verifyToken, async (req, res) => {
  try {
    const { account_id } = req.user;
    const { receiver_account_id, content } = req.body;

    if (!content || content.trim() === "") {
      console.warn("⚠ Message content cannot be empty.");
      return res.status(400).json({ error: "Message content cannot be empty." });
    }

    // ✅ Insert message into Messages table
    await db.query(
      "INSERT INTO Messages (sender_account_id, receiver_account_id, content, timestamp) VALUES (?, ?, ?, NOW())",
      [account_id, receiver_account_id, content]
    );

    res.json({ message: "✅ Message sent!" });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
