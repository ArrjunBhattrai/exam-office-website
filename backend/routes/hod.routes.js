const express = require("express");
const router = express.Router();
const { authenticateHOD, verifyHODPassword } = require("../middleware/auth");
const {
  hodLogin,
  getDepartmentDetails,
  getSemesters,
  getSubjectsBySemester,
  addSemester,
  updateSemester,
  deleteSemester,
  addSubject,
  updateSubject,
  deleteSubject,
  getFacultyBySubject,
  assignSubjectToFaculty,
  removeFacultyFromSubject,
} = require("../controllers/hod");

// HOD Login
router.post("/login", hodLogin);

// Department Details
router.get("/department", authenticateHOD, getDepartmentDetails);

// Semester Management
router.get("/semesters", authenticateHOD, getSemesters);
router.post("/semesters", authenticateHOD, verifyHODPassword, addSemester);
router.put("/semesters/:id", authenticateHOD, verifyHODPassword, updateSemester);
router.delete("/semesters/:id", authenticateHOD, verifyHODPassword, deleteSemester);

// Subject Management
router.get("/semesters/:semester_id/subjects", authenticateHOD, getSubjectsBySemester);
router.post("/semesters/:semester_id/subjects", authenticateHOD, verifyHODPassword, addSubject);
router.put("/subjects/:id", authenticateHOD, verifyHODPassword, updateSubject);
router.delete("/subjects/:id", authenticateHOD, verifyHODPassword, deleteSubject);

// Faculty Assignment
router.get("/subjects/:subject_id/faculty", authenticateHOD, getFacultyBySubject);
router.post("/assign-faculty", authenticateHOD, verifyHODPassword, assignSubjectToFaculty);
router.delete("/remove-faculty", authenticateHOD, verifyHODPassword, removeFacultyFromSubject);

module.exports = router;