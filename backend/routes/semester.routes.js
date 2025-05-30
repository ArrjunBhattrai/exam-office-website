const  express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const semesterController = require("../controller/semester");

router.get(
  "/get-semesters",
  authenticateUser,
  authorizeRole(["admin", "hod"]),
  semesterController.getSemesters
);

module.exports = router;