const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const axios = require("axios");
const verifyToken = require("../middleware/authMiddleware");

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
    console.log(`🌍 Fetching location for IP: ${ip}`);
    const response = await axios.get(`http://ip-api.com/json/${ip}`);

    if (response.data.status === "success" && response.data.city) {
      console.log(`✅ Location found: ${response.data.city}`);
      return response.data.city;
    } else {
      console.warn("⚠ IP-API did not return a valid location.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching location:", error);
    return null;
  }
};

// ✅ REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    console.log("🟢 Incoming Registration Request:", req.body);

    const { email, password, first_name, last_name, age, interests, religion, languages } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const location = await getLocationFromIP(ip) || "Unknown";

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
      [
        account_id,
        email,
        hashedPassword,
        first_name,
        last_name,
        age,
        location,
        JSON.stringify(interests || []), // Ensure interests are stored as JSON
        religion || null,
        JSON.stringify(languages || []), // Ensure languages are stored as JSON
      ]
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
    const newLocation = await getLocationFromIP(ip); // ✅ Fetch location from IP-API

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

    // ✅ Update User Location in Database (only if a valid new location is found)
    if (newLocation && newLocation !== "Unknown") {
      console.log(`📍 Updating user location in database: ${newLocation}`);
      await db.query("UPDATE Users SET location = ? WHERE account_id = ?", [newLocation, user.account_id]);
    }

    // ✅ Fix: Ensure interests & languages are parsed correctly
    let interests = [];
    let languages = [];
    try {
      interests = JSON.parse(user.interests || "[]");
      languages = JSON.parse(user.languages || "[]");
    } catch (parseError) {
      console.error("❌ Error parsing JSON fields:", parseError);
    }

    res.json({
      message: "✅ Login successful!",
      token,
      user: {
        id: user.account_id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        location: newLocation || user.location, // ✅ Use updated location if available
        interests,
        religion: user.religion,
        languages,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ PROTECTED USER PROFILE ROUTE
router.get("/profile", verifyToken, async (req, res) => {
  try {
    console.log("🟢 Fetching Profile for User ID:", req.user.account_id);

    const [users] = await db.query(
      `SELECT account_id, first_name, last_name, age, location, interests, religion, languages, email 
       FROM Users WHERE account_id = ?`,
      [req.user.account_id]
    );

    if (users.length === 0) return res.status(404).json({ error: "User not found" });

    const user = users[0];

    // ✅ Fix: Ensure interests & languages are parsed correctly
    let interests = [];
    let languages = [];
    try {
      interests = JSON.parse(user.interests || "[]");
      languages = JSON.parse(user.languages || "[]");
    } catch (parseError) {
      console.error("❌ Error parsing JSON fields:", parseError);
    }

    res.json({
      id: user.account_id,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      location: user.location,
      interests,
      religion: user.religion,
      languages,
      email: user.email,
    });
  } catch (error) {
    console.error("❌ Profile fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ LOGOUT ROUTE
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "✅ Logged out successfully!" });
});

module.exports = router;
