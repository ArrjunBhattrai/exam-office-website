const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const hodController = require("../controller/hod");

//Get Details
router.get("/branch-details", authenticateUser, authorizeRole(["hod"]),hodController.getBranchDetails);
router.get("/branch-faculties", authenticateUser, authorizeRole(["hod"]),hodController.getFaculties);
router.get("/branch-subjects", authenticateUser, authorizeRole(["hod"]),hodController.getSubjects);

//Faculty Assignment
router.post("/assign-faculty", authenticateUser, authorizeRole(["hod"]),hodController.assignFaculty);
router.put("/update-faculty", authenticateUser, authorizeRole(["hod"]),hodController.updateAssignedFaculty);
router.delete("/remove-assignedfaculty", authenticateUser, authorizeRole(["hod"]),hodController.removeAssignedFaculty);

module.exports = router;