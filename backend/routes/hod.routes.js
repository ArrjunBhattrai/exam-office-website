const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const hodController = require("../controller/hod");

// Branch Details
router.get("/branch/details", authenticateUser, authorizeRole(["hod"]), hodController.getBranchDetails);
router.get("/branch/faculties", authenticateUser, authorizeRole(["hod"]), hodController.getFaculties);
router.get("/branch/subjects", authenticateUser, authorizeRole(["hod"]), hodController.getSubjects);

// Faculty Registration Requests
router.get("/faculty/requests", authenticateUser, authorizeRole(["hod"]), hodController.getPendingFacultyRequests);
router.post("/faculty/requests/approve", authenticateUser, authorizeRole(["hod"]), hodController.approveFacultyRequest);
router.delete("/faculty/requests/reject", authenticateUser, authorizeRole(["hod"]), hodController.rejectFacultyRequest);

// Faculty Assignment
router.post("/faculty/assign", authenticateUser, authorizeRole(["hod"]), hodController.assignFaculty);
router.put("/faculty/update-assignment", authenticateUser, authorizeRole(["hod"]), hodController.updateAssignedFaculty);
router.delete("/faculty/remove-assignment", authenticateUser, authorizeRole(["hod"]), hodController.removeAssignedFaculty);

module.exports = router;
