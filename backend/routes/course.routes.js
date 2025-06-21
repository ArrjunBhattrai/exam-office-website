const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const courseController = require("../controller/course");

router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  courseController.createCourse
);
router.get(
  "/",
  authenticateUser,
  authorizeRole(["admin", "hod"]),
  courseController.getCourses
);
router.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  courseController.deleteCourse
);

module.exports = router;
