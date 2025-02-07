const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const cookieParser = require("cookie-parser");

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes"); // ✅ Messaging API
const friendsRoutes = require("./routes/friendsRoutes"); // ✅ Friends API

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000"; // ✅ Fix ENOTFOUND issue

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handle form submissions
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Update if frontend is hosted elsewhere
    credentials: true,
  })
);

// ✅ Attach Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes); // ✅ Attach Messaging API
app.use("/api/friends", friendsRoutes); // ✅ Attach Friends API

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at ${API_BASE_URL}`);
});
