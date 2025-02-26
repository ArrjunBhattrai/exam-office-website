const express = require("express");
const router = express.Router();
const { authenticate } = require("../util/middleware");
const {
  registerExamOfficer,
  login,
  getExamOfficer,
} = require("../controller/examOfficer");

// Register Exam Officer
router.post("/register", registerExamOfficer);

// Login Exam Officer
router.post("/login", login);

// Get Exam Officer Profile
router.get("/profile/:id", authenticate, getExamOfficer);

module.exports = router;
