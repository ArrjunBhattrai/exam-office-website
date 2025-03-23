const express = require("express");
const router = express.Router();
const { authenticate } = require("../util/middleware");
const {
  register,
  login,
  getUser,
  updateProfile,
  findUser,
} = require("../controller/user");

// Register Exam Officer
router.post("/register", register);

// Login Exam Officer
router.post("/login", login);

// Get Exam Officer Profile
router.get("/profile/", authenticate, getUser);

router.get("/profile/:id", authenticate, findUser);

router.put("/profile/:id", authenticate, updateProfile);

module.exports = router;
