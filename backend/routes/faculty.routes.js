const express = require("express");
const router = express.Router();
const facultyController = require("../controller/faculty");

// Faculty Authentication
router.post("/login", facultyController.facultyLogin);

// Faculty-related routes
router.get("/subjects/:faculty_id", facultyController.subjectByFaculty);
router.get("/students/:subject_id", facultyController.studentBySubject);
router.post("/assign-co", facultyController.assignCO);

// Marks submission & retrieval
router.post("/marks", facultyController.submitMarks);
router.get("/marks/:subject_id/:component_name/:sub_component_name", facultyController.getStudentMarks);

module.exports = router;
