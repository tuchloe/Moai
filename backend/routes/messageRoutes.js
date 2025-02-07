const express = require("express");
const db = require("../database/database"); // ✅ Database connection
const verifyToken = require("../middleware/authMiddleware"); // ✅ Protect routes

const router = express.Router();

// ✅ Send a Message
router.post("/send", verifyToken, async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    // ✅ Debugging - Log incoming request
    console.log("📩 Incoming Message Data:", req.body);

    // ✅ Check for missing fields
    if (!senderId || !receiverId || !content?.trim()) {
      return res.status(400).json({
        error: "All fields are required",
        missing: {
          senderId: senderId || "Missing",
          receiverId: receiverId || "Missing",
          content: content || "Missing",
        },
      });
    }

    // ✅ Ensure receiverId exists in the database
    const [receiverExists] = await db.query(
      "SELECT account_id FROM Users WHERE account_id = ?",
      [receiverId]
    );

    if (receiverExists.length === 0) {
      return res.status(404).json({ error: "Receiver does not exist" });
    }

    // ✅ Insert message into the database
    await db.query(
      "INSERT INTO Messages (sender_account_id, receiver_account_id, content, timestamp) VALUES (?, ?, ?, NOW())",
      [senderId, receiverId, content]
    );

    res.json({ message: "✅ Message sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get Messages Between Two Users (Conversation History)
router.get("/:user1/:user2", verifyToken, async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const [messages] = await db.query(
      `SELECT sender_account_id, receiver_account_id, content, timestamp 
       FROM Messages 
       WHERE (sender_account_id = ? AND receiver_account_id = ?) 
          OR (sender_account_id = ? AND receiver_account_id = ?) 
       ORDER BY timestamp ASC`,
      [user1, user2, user2, user1]
    );

    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get All Conversations for a User (Inbox View)
router.get("/inbox/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const [conversations] = await db.query(
      `SELECT DISTINCT u.account_id, u.first_name, u.last_name
       FROM Messages m
       JOIN Users u ON (m.sender_account_id = u.account_id OR m.receiver_account_id = u.account_id)
       WHERE (m.sender_account_id = ? OR m.receiver_account_id = ?) 
       AND u.account_id != ?`,
      [userId, userId, userId]
    );

    res.json(conversations);
  } catch (error) {
    console.error("❌ Error fetching inbox:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
