const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const { upload } = require("../middleware/upload")
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

//Routes for uploading data
router.post("/upload/academic-scheme", authenticateUser, authorizeRole(["admin"]), upload.single("file"), adminController.academicSchemeUpload);
router.post("/upload/student-data", authenticateUser, authorizeRole(["admin"]), upload.single("file"), adminController.studentDataUpload);



module.exports = router;