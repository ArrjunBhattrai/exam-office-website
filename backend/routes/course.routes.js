const express = require("express");
const router = express.Router();
const { authenticate } = require("../util/middleware");
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
  getAllCourses,
} = require("../controller/course");

// Register Course
router.post("/create", authenticate, createCourse);

router.get("/courses", authenticate, getAllCourses);

// Update Course
router.put("/update/:id", authenticate, updateCourse);

// Delete Course
router.delete("/delete", authenticate, deleteCourse);

router.get("/:id", authenticate, getCourseById);

module.exports = router;
