const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const adminController = require("../controller/admin");

//Routes for course managemanet(Admin Only)
router.post("/course/create", authenticateUser, authorizeRole(["admin"]), adminController.createCourse);
router.delete("/course/:course_id", authenticateUser, authorizeRole(["admin"]), adminController.deleteCourse);
router.get("/courses", authenticateUser, authorizeRole(["admin"]), adminController.getCourses);

// Routes for branch management (Admin Only)
router.post("/branch/create", authenticateUser, authorizeRole(["admin"]), adminController.createBranch);
router.delete("/branch/:branch_id", authenticateUser, authorizeRole(["admin"]), adminController.deleteBranch);
router.get("/branches", authenticateUser, authorizeRole(["admin"]), adminController.getBranches);
router.get("/branches/byCourse", authenticateUser, authorizeRole(["admin"]),adminController.getBranchesByCourseId);


module.exports = router;