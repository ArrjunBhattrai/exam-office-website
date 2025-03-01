const express = require("express");
const router = express.Router();
const { authenticateHOD, authenticate } = require("../util/middleware");
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
  removeFacultyFromSubject,
} = require("../controller/hod");

// HOD Login
router.post("/login", hodLogin);

// Department & Semester Management
router.get("/", getDepartment);
router.post("/semester", authenticate, addSemester);
router.post("/semester/subject/", authenticate, addSubject);
router.get("/semester/:id/subjects", getSubjectsBySemester);
router.put("/semester/:id", authenticate, updateSemester);
router.delete("/semester/:id", authenticate, deleteSemester);
router.put("/subject/", authenticate, updateSubject);
router.delete("/subject/:id", authenticate, deleteSubject);

// Faculty Assignment
router.get("/subject/:id/faculty", getFacultyBySubject);
router.post("/assign-subject", authenticate, assignSubjectToFaculty);
router.delete("/remove-faculty", authenticate, removeFacultyFromSubject);

module.exports = router;
