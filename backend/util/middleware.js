const jwt = require("jsonwebtoken");

// Middleware for authentication
const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied" });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.officer_id = verified.officer_id;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};
module.exports = {
  authenticate,
};
