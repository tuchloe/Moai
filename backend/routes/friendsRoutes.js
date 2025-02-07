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
      return res.status(200).json([]); // Return empty array if no friends found
    }

    res.json(friends);
  } catch (error) {
    console.error("❌ Error fetching friends list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
