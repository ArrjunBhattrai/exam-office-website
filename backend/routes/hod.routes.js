const express = require("express");
const router = express.Router();
const { authenticateHOD } = require("../middleware/auth");
const {
  hodLogin,
  getDepartment,
  addSemester,
  updateSemester,
  deleteSemester,
  getSubjectsBySemester,
  addSubject,
  updateSubject,
  deleteSubject,
  getFacultyBySubject,
  assignSubjectToFaculty,
  removeFacultyFromSubject
} = require("../controllers/hod");

// HOD Login
router.post("/login", hodLogin);

// Department & Semester Management
router.get("/department", authenticateHOD, getDepartment);
router.post("/semester", authenticateHOD, addSemester);
router.put("/semester/:id", authenticateHOD, updateSemester);
router.delete("/semester/:id", authenticateHOD, deleteSemester);

// Subject Management
router.get("/semester/:id/subjects", authenticateHOD, getSubjectsBySemester);
router.post("/semester/:id/subject", authenticateHOD, addSubject);
router.put("/subject/:id", authenticateHOD, updateSubject);
router.delete("/subject/:id", authenticateHOD, deleteSubject);

// Faculty Assignment
router.get("/subject/:id/faculty", authenticateHOD, getFacultyBySubject);
router.post("/assign-subject", authenticateHOD, assignSubjectToFaculty);
router.delete("/remove-faculty", authenticateHOD, removeFacultyFromSubject);

module.exports = router;
