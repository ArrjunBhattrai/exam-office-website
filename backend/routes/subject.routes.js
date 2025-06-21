const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const subjectController = require("../controller/subject");

router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  upload.single("file"),
  subjectController.subjectDataUpload
);
router.get(
  "/",
  authenticateUser,
  authorizeRole(["hod"]),
  subjectController.getAllSubjectsForCourse
);
router.get(
  "/:faculty_id",
  authenticateUser,
  authorizeRole(["faculty", "hod"]),
  subjectController.getAssignedSubject
);
router.post(
  "/assign-co",
  authenticateUser,
  authorizeRole(["faculty"]),
  subjectController.assignCO
);
router.get(
  "/co/:subject_id/:subject_type",
  authenticateUser,
  authorizeRole(["faculty"]),
  subjectController.getCourseOutcomes
);
router.get(
  "/get-subject-byCourse",
  authenticateUser,
  authorizeRole(["hod"]),
  subjectController.getSubjectsForCourse
);

module.exports = router;