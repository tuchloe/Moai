const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import cors
const dotenv = require('dotenv'); // Import dotenv

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000

app.use(express.json()); // Enable parsing of JSON requests

// Enable CORS and restrict to your React app's URL
app.use(cors({ origin: 'http://localhost:5173' })); // Replace with React app's actual URL

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,        // Use environment variables
  user: process.env.DB_USER,        // Use environment variables
  password: process.env.DB_PASSWORD, // Use environment variables
  database: process.env.DB_NAME,    // Use environment variables
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to the database.");
});

// Route to test database connection
app.get('/test-db', (req, res) => {
  db.query('SELECT 1', (err, result) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).send('Database query failed.');
      return;
    }
    res.send('Database is successfully connected to the server');
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Express server is running correctly. To test database connection, go to /test-db.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
