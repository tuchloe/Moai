const express = require("express");
const mysql = require("mysql2/promise"); // Required for database connection pooling
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios"); // Useful for external API calls (e.g., IP-based location services)
const cookieParser = require("cookie-parser");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const friendsRoutes = require("./routes/friendsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

// ✅ Database Connection Pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // Replace with your database host
  user: process.env.DB_USER || "root", // Replace with your database user
  password: process.env.DB_PASSWORD || "", // Replace with your database password
  database: process.env.DB_NAME || "my_database", // Replace with your database name
  port: process.env.DB_PORT || 3306, // Replace with your database port (default is 3306)
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0,
});

// ✅ Middleware to Attach `db` to `req` Object
app.use((req, res, next) => {
  req.db = db; // Attach the database pool to the request object
  next();
});

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

// ✅ Test Route to Verify Database Connection
app.get("/api/test", async (req, res) => {
  try {
    const [rows] = await req.db.query("SELECT 1 + 1 AS result");
    res.json({ message: "✅ API is working!", result: rows[0].result });
  } catch (error) {
    console.error("❌ Database connection error:", error);
    res.status(500).json({ error: "Database connection error" });
  }
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
