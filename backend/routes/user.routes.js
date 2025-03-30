const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
} = require("../controller/user");

// Register an user
router.post("/register", registerUser);

// Login an user
router.post("/login", loginUser);

module.exports = router;
