const jwt = require("jsonwebtoken");
const db = require("../db/db"); 

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;

    let user;
    if (decoded.role === "admin") {
      user = await db("admin").where({ admin_id: decoded.userId }).first();
    } else if (decoded.role === "hod") {
      user = await db("hod").where({ hod_id: decoded.userId }).first();
    }else if (decoded.role === "faculty") {
      user = await db("faculty").where({ faculty_id: decoded.userId }).first();
    } 

    if (!user) return res.status(403).json({ error: "Invalid token or user does not exist" });
     
     req.user = {
      userId: decoded.userId,
      role: decoded.role,
      branchId: user.branch_id || null, // Only present for hod/faculty
    };
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(403).json({ error: "Invalid token" });
  }
};

const authorizeRole = (allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRole };
