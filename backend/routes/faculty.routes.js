const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const facultyController = require("../controller/faculty");

router.get("/assignedSubjects/:facultyId", authenticateUser, authorizeRole(["faculty"]), facultyController.getAssignedSubject);
router.post("/assign-cos", authenticateUser, authorizeRole(["faculty"]), facultyController.assignCO);
router.get("/get-co/:subject_id/:subject_type", authenticateUser, authorizeRole(["faculty"]), facultyController.getCourseOutcomes);
router.post("/insert-test-details", authenticateUser, authorizeRole(["faculty"]), facultyController.insertTestDetails);
router.get("/getStudents/:subject_id/:subject_type", authenticateUser, authorizeRole(["faculty"]), facultyController.studentBySubject);
router.post("/submitMarks", authenticateUser, authorizeRole(["faculty"]), facultyController.submitMarks);




module.exports = router;
