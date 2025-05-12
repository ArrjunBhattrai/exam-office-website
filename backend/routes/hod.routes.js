const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const hodController = require("../controller/hod");

// Branch Details
router.get("/branch/faculties", authenticateUser, authorizeRole(["hod"]), hodController.getFaculties);
router.get("/branch/semesters", authenticateUser, authorizeRole(["hod"]), hodController.getDistinctSemester);
router.get("/branch/subjects/:semester", authenticateUser, authorizeRole(["hod"]), hodController.getSubjectDetailsBySemester);
router.get("/branch/details/:semester", authenticateUser, authorizeRole(["hod"]), hodController.getDepartmentDetails);

// Faculty Registration Requests
router.get("/faculty/requests", authenticateUser, authorizeRole(["hod"]), hodController.getPendingFacultyRequests);
router.post("/faculty/requests/approve", authenticateUser, authorizeRole(["hod"]), hodController.approveFacultyRequest);
router.delete("/faculty/requests/reject", authenticateUser, authorizeRole(["hod"]), hodController.rejectFacultyRequest);

// Faculty Assignment
router.post("/faculty-assignment", authenticateUser, authorizeRole(["hod"]), hodController.assignOrUpdateFaculty);

module.exports = router;
