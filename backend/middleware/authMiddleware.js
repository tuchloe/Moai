const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyToken = (req, res, next) => {
  let token = req.cookies?.token || req.headers["authorization"]; // ✅ Support for both Cookies & Authorization Header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // ✅ Ensure token format is correct (if using "Bearer" in Authorization header)
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
