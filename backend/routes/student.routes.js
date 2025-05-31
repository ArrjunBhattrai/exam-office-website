const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const studentController = require("../controller/student");

router.post(
  "/upload/student-data",
  authenticateUser,
  authorizeRole(["admin"]),
  upload.single("file"),
  studentController.studentDataUpload
);
router.get(
  "/get-student-byCourse",
  authenticateUser,
  authorizeRole(["hod"]),
  studentController.getStudentsForCourse
);
router.get(
  "/getStudents/:subject_id/:subject_type",
  authenticateUser,
  authorizeRole(["faculty", "hod"]),
  studentController.studentBySubject
);

module.exports = router;
