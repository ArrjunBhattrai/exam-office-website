const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const courseController = require("../controller/course");

router.post(
  "/create-course",
  authenticateUser,
  authorizeRole(["admin"]),
  courseController.createCourse
);
router.delete(
  "/delete-course",
  authenticateUser,
  authorizeRole(["admin"]),
  courseController.deleteCourse
);
router.get(
  "/get-courses",
  authenticateUser,
  authorizeRole(["admin"]),
  courseController.getCourses
);
router.get(
  "/get-courses-byBranch",
  authenticateUser,
  authorizeRole(["admin", "hod"]),
  courseController.getCourseByBranch
)

module.exports = router;
