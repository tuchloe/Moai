const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyToken = (req, res, next) => {
  try {
    let token = req.cookies?.token || req.headers["authorization"];

    if (!token) {
      console.warn("⚠ No token provided. Unauthorized request.");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // ✅ Ensure token format is correct (handle "Bearer" prefix)
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    // ✅ Verify JWT Token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("❌ Token verification failed:", err.message);

        if (err.name === "TokenExpiredError") {
          return res.status(403).json({ error: "Forbidden: Token has expired. Please log in again." });
        }

        return res.status(403).json({ error: "Forbidden: Invalid token" });
      }

      // ✅ Ensure decoded contains `account_id`
      if (!decoded.id) {
        console.error("❌ Decoded token is missing account_id:", decoded);
        return res.status(403).json({ error: "Forbidden: Invalid token structure" });
      }

      // ✅ Attach user ID & email (if available) to `req.user`
      req.user = {
        account_id: decoded.id,
        email: decoded.email || null, // Store email if present
      };

      console.log("✅ Token verified successfully for user:", req.user.account_id);
      next();
    });
  } catch (error) {
    console.error("❌ Unexpected error in token verification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = verifyToken;
