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
  "/faculty-subjects/:faculty_id",
  authenticateUser,
  authorizeRole(["faculty"]),
  subjectController.getFacultySubjects
);
router.get(
  "/assignedSubject-details/:faculty_id",
  authenticateUser,
  authorizeRole(["faculty"]),
  subjectController.getAssignedSubjectDetails
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

module.exports = router;
