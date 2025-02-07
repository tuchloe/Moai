const express = require("express");
const db = require("../database/database"); // ✅ Database connection
const verifyToken = require("../middleware/authMiddleware"); // ✅ Protect routes

const router = express.Router();

// ✅ GET a User's Friends List
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Fetch friends where the status is 'Accepted'
    const [friends] = await db.query(
      `SELECT u.account_id, u.first_name, u.last_name 
       FROM Friends f 
       JOIN Users u ON f.friend_account_id = u.account_id 
       WHERE f.user_account_id = ? AND f.status = 'Accepted'`,
      [userId]
    );

    if (friends.length === 0) {
      return res.status(404).json({ error: "No friends found" });
    }

    res.json(friends);
  } catch (error) {
    console.error("❌ Error fetching friends list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Send Friend Request
router.post("/request", verifyToken, async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Sender and receiver IDs are required" });
    }

    // ✅ Check if a friend request already exists
    const [existing] = await db.query(
      "SELECT * FROM Friends WHERE user_account_id = ? AND friend_account_id = ?",
      [senderId, receiverId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    await db.query(
      "INSERT INTO Friends (user_account_id, friend_account_id, status) VALUES (?, ?, 'Pending')",
      [senderId, receiverId]
    );

    res.json({ message: "✅ Friend request sent!" });
  } catch (error) {
    console.error("❌ Error sending friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Accept or Reject Friend Request
router.put("/respond", verifyToken, async (req, res) => {
  try {
    const { userId, friendId, status } = req.body; // Status should be 'Accepted' or 'Rejected'

    if (!userId || !friendId || !["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    await db.query(
      "UPDATE Friends SET status = ? WHERE user_account_id = ? AND friend_account_id = ?",
      [status, friendId, userId]
    );

    res.json({ message: `✅ Friend request ${status.toLowerCase()}!` });
  } catch (error) {
    console.error("❌ Error updating friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Remove a Friend
router.delete("/remove", verifyToken, async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
      return res.status(400).json({ error: "User ID and Friend ID are required" });
    }

    await db.query(
      "DELETE FROM Friends WHERE (user_account_id = ? AND friend_account_id = ?) OR (user_account_id = ? AND friend_account_id = ?)",
      [userId, friendId, friendId, userId]
    );

    res.json({ message: "✅ Friend removed successfully" });
  } catch (error) {
    console.error("❌ Error removing friend:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
