const jwt = require("jsonwebtoken");
require('dotenv').config();



const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No authorization header provided." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access denied. Token missing." });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token. Access forbidden." });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};


module.exports = { verifyToken };