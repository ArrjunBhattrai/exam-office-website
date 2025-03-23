const express = require("express");
const router = express.Router();
const { authenticateHOD } = require("../util/middleware");
const hodController = require("../controller/hod");

// HOD Login
router.post("/login", hodController.hodLogin);

// Department Management
router.get("/", authenticateHOD, hodController.getDepartmentDetails);

// Faculty Management
router.post("/faculty", authenticateHOD, hodController.createFaculty);
router.delete(
  "/faculty/:faculty_id",
  authenticateHOD,
  hodController.deleteFaculty
);

// Faculty Allocation
router.get(
  "/subject/:id/faculty",
  authenticateHOD,
  hodController.getFacultyBySubject
);
router.post(
  "/faculty/assign",
  authenticateHOD,
  hodController.assignSubjectToFaculty
);
router.delete(
  "/faculty/remove",
  authenticateHOD,
  hodController.removeFacultyFromSubject
);

module.exports = router;
