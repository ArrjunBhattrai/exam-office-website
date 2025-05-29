const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const subjectController = require("../controller/subject");

router.post(
  "/upload/subject-data",
  authenticateUser,
  authorizeRole(["admin"]),
  upload.single("file"),
  subjectController.subjectDataUpload
);
router.get(
  "/get-subject-byCourse",
  authenticateUser,
  authorizeRole(["hod"]),
  subjectController.getSubjectsForCourse
);
router.get(
  "/assignedSubjects/:facultyId",
  authenticateUser,
  authorizeRole(["faculty", "hod"]),
  subjectController.getAssignedSubject
);
router.post(
  "/assign-cos",
  authenticateUser,
  authorizeRole(["faculty"]),
  subjectController.assignCO
);
router.get(
  "/get-co/:subject_id/:subject_type",
  authenticateUser,
  authorizeRole(["faculty"]),
  subjectController.getCourseOutcomes
);
router.get(
  "/get-subjects-by-course",
  authenticateUser,
  authorizeRole(["hod"]),
  subjectController.getAllSubjectsForCourse
);

module.exports = router;
