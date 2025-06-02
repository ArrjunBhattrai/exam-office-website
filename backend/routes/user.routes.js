const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  infoUpdate
} = require("../controller/user");

// Register an user
router.post("/register", registerUser);

// Login an user
router.post("/login", loginUser);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

//update user info
router.post('/info-update', infoUpdate);

module.exports = router;
