const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const axios = require("axios");
const verifyToken = require("../middleware/authMiddleware"); // Middleware for protected routes

dotenv.config();

const router = express.Router();

// ✅ Database Connection Pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Function to Fetch User Location from IP-API
const getLocationFromIP = async (ip) => {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data.status === "success" ? response.data.city : "Unknown";
  } catch (error) {
    console.error("❌ Error fetching location:", error);
    return "Unknown";
  }
};

// ✅ REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    console.log("🟢 Incoming Registration Request:", req.body);

    const { email, password, first_name, last_name, age, interests, religion, languages } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const location = await getLocationFromIP(ip);

    if (!email || !password || !first_name || !last_name || !age) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    // 🔎 Check if user already exists
    const [existingUser] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (existingUser.length > 0) return res.status(400).json({ error: "Email already in use" });

    // 🔑 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🆕 Insert new user
    const account_id = require("crypto").randomUUID();
    await db.query(
      `INSERT INTO Users (account_id, email, password, first_name, last_name, age, location, interests, religion, languages, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [account_id, email, hashedPassword, first_name, last_name, age, location, JSON.stringify(interests), religion, JSON.stringify(languages)]
    );

    res.status(201).json({ message: "✅ User registered successfully!", userId: account_id });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ LOGIN ROUTE (Returns Full User Profile & Updates Location)
router.post("/login", async (req, res) => {
  try {
    console.log("🟢 Incoming Login Request:", req.body);

    const { email, password } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const location = await getLocationFromIP(ip);

    if (!email || !password) return res.status(400).json({ error: "Email and password are required." });

    // 🔍 Find user
    const [users] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ error: "User not found" });

    const user = users[0];

    // 🔒 Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // 🔑 Generate JWT Token
    const token = jwt.sign({ id: user.account_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // 🍪 Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // ✅ Update User Location in Database on Login
    await db.query("UPDATE Users SET location = ? WHERE account_id = ?", [location, user.account_id]);

    res.json({
      message: "✅ Login successful!",
      token,
      user: {
        id: user.account_id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        location: location,
        interests: JSON.parse(user.interests || "[]"),
        religion: user.religion,
        languages: JSON.parse(user.languages || "[]"),
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ LOGOUT ROUTE
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "✅ Logged out successfully!" });
});

// ✅ PROTECTED USER PROFILE ROUTE
router.get("/profile", verifyToken, async (req, res) => {
  try {
    console.log("🟢 Fetching Profile for User ID:", req.user.id);

    const [users] = await db.query(
      `SELECT account_id, first_name, last_name, age, location, interests, religion, languages, email 
       FROM Users WHERE account_id = ?`,
      [req.user.id]
    );

    if (users.length === 0) return res.status(404).json({ error: "User not found" });

    const user = users[0];
    user.interests = JSON.parse(user.interests || "[]");
    user.languages = JSON.parse(user.languages || "[]");

    res.json(user);
  } catch (error) {
    console.error("❌ Profile fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

