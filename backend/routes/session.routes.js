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
  "/download",
  authenticateUser,
  authorizeRole(["admin"]),
  sessionController.downloadSessionData
);

router.get(
  "/all",
  authenticateUser,
  authorizeRole(["admin"]),
  sessionController.getAllSessions
);

module.exports = router