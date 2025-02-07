const express = require("express");
const mysql = require("mysql2/promise"); // Required for database connection pooling
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios"); // Useful for external API calls (e.g., IP-based location services)
const cookieParser = require("cookie-parser");

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const friendsRoutes = require("./routes/friendsRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handle form submissions
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this if frontend is hosted elsewhere
    credentials: true,
  })
);

// ✅ Test Route (Add this for debugging purposes)
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ API is working!" });
});

// ✅ Attach Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friends", friendsRoutes);

// ✅ Catch-All Route for Undefined Endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at ${API_BASE_URL}`);
});
