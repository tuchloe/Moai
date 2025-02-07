const mysql = require("mysql2/promise"); // ✅ Use `mysql2/promise` for async queries

// ✅ Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // ✅ Load from environment variables
  user: process.env.DB_USER || "chloetu",
  password: process.env.DB_PASSWORD || "CKpassword",
  database: process.env.DB_NAME || "moaidb",
  waitForConnections: true,
  connectionLimit: 10, // ✅ Set a reasonable connection limit
  queueLimit: 0,
});

// ✅ Test Database Connection on Startup
db.getConnection()
  .then((connection) => {
    console.log("✅ Connected to MySQL database.");
    connection.release(); // ✅ Release connection back to pool
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // ❌ Exit process if DB connection fails
  });

module.exports = db; // ✅ Export MySQL pool for use in other files
