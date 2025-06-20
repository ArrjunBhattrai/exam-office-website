const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const studentController = require("../controller/student");

router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  upload.single("file"),
  studentController.studentDataUpload
);
router.get(
  "/",
  authenticateUser,
  authorizeRole(["faculty", "hod"]),
  studentController.studentBySubject
);
router.get(
  "/get-student-byCourse",
  authenticateUser,
  authorizeRole(["hod"]),
  studentController.getStudentsForCourse
);


module.exports = router;
