const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const adminContorller = require("../controller/admin");

//Routes for course managemanet(Admin Only)
router.post("/course/create", authenticateUser, authorizeRole(["admin"]), adminContorller.createCourse);
router.delete("/course/:course_id", authenticateUser, authorizeRole(["admin"]), adminContorller.deleteCourse);
router.get("/courses", authenticateUser, authorizeRole(["admin"]), adminContorller.getCourses);

// Routes for branch management (Admin Only)
router.post("/branch/create", authenticateUser, authorizeRole(["admin"]), adminContorller.createBranch);
router.delete("/branch/:branch_id", authenticateUser, authorizeRole(["admin"]), adminContorller.deleteBranch);
router.get("/branches", authenticateUser, authorizeRole(["admin"]), adminContorller.getBranches);

module.exports = router;