const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const sectionController = require("../controller/section");

router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  sectionController.createSection
);

module.exports = router;