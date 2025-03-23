const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Middleware to authenticate HOD
const authenticateHOD = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "HOD") {
      return res.status(403).json({ message: "Access denied. Not a HOD." });
    }

    req.hod_id = decoded.hod_id;
    req.department_id = decoded.department_id;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Middleware to verify HOD's password for sensitive operations
const verifyHODPassword = async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  try {
    const hod = await db("hod").where({ id: req.hod_id }).first();

    if (!hod || !(await bcrypt.compare(password, hod.password))) {
      return res.status(401).json({ message: "Invalid password." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error verifying password.", error });
  }
};

module.exports = { authenticateHOD, verifyHODPassword };