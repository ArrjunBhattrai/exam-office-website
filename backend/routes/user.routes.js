const express = require("express");
const router = express.Router();
const { authenticate } = require("../util/middleware");
const {
  register,
  login,
  getUser,
  updateProfile,
} = require("../controller/user");

// Register Exam Officer
router.post("/register", register);

// Login Exam Officer
router.post("/login", login);

// Get Exam Officer Profile
router.get("/profile/:id", getUser);

router.put("/profile/:id", authenticate, updateProfile);

module.exports = router;
