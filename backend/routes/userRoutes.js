const express = require("express");
const db = require("../database/database");
const verifyToken = require("../middleware/authMiddleware"); // Middleware for protected routes

const router = express.Router();

/* ✅ GET User Profile */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const [user] = await db.query(
      "SELECT first_name AS name, age, location, languages, interests, bio, profile_picture AS profilePic FROM Users WHERE account_id = ?",
      [req.params.id]
    );
    if (user.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(user[0]);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ✅ UPDATE User Profile */
router.put("/:id", verifyToken, async (req, res) => {
  const { name, age, location, languages, interests, bio, profilePic } = req.body;
  try {
    await db.query(
      "UPDATE Users SET first_name = ?, age = ?, location = ?, languages = ?, interests = ?, bio = ?, profile_picture = ? WHERE account_id = ?",
      [name, age, location, languages, interests, bio, profilePic, req.params.id]
    );
    res.json({ message: "✅ Profile updated successfully" });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ✅ GET Random Local User with Filters */
router.get("/meet-someone-new", verifyToken, async (req, res) => {
  try {
    const { account_id } = req.user; // Get current user ID
    const { language, religion, interests } = req.query;

    // 🔍 Get current user's location
    const [currentUser] = await db.query("SELECT location FROM Users WHERE account_id = ?", [account_id]);
    if (!currentUser.length) return res.status(404).json({ error: "User not found" });

    const location = currentUser[0].location;

    // 🔎 Build SQL query with optional filters
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
      const interestArray = JSON.parse(interests);
      query += ` AND JSON_OVERLAPS(interests, ?)`;
      queryParams.push(JSON.stringify(interestArray));
    }

    query += " ORDER BY RAND() LIMIT 1"; // Pick a random user

    const [users] = await db.query(query, queryParams);

    if (!users.length) return res.status(404).json({ message: "No matches found." });

    res.json(users[0]);
  } catch (error) {
    console.error("❌ Error fetching random user:", error);
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
    if (!friend.length) return res.status(404).json({ error: "User not found" });

    // ❌ Prevent duplicate requests
    const [existingRequest] = await db.query(
      "SELECT * FROM Friends WHERE (user_account_id = ? AND friend_account_id = ?) OR (user_account_id = ? AND friend_account_id = ?)",
      [account_id, friend_account_id, friend_account_id, account_id]
    );

    if (existingRequest.length > 0) return res.status(400).json({ error: "Friend request already sent or accepted." });

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
      return res.status(400).json({ error: "Message content cannot be empty." });
    }

    // ✅ Insert message into Messages table
    await db.query("INSERT INTO Messages (sender_account_id, receiver_account_id, content, timestamp) VALUES (?, ?, ?, NOW())",
      [account_id, receiver_account_id, content]);

    res.json({ message: "✅ Message sent!" });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
