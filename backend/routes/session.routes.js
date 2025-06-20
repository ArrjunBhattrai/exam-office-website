const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const sessionController  = require("../controller/session");

router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  sessionController.createSession
);

router.get(
  "/",
  authenticateUser,
  authorizeRole(["admin", "hod", "faculty"]),
  sessionController.createSession
);

module.exports = router