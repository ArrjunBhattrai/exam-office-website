const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const facultyController = require("../controller/faculty");

router.get(
  "/registration-requests",
  authenticateUser,
  authorizeRole(["hod"]),
  facultyController.getPendingFacultyRequests
);
router.post(
  "/approve-request",
  authenticateUser,
  authorizeRole(["hod"]),
  facultyController.approveFacultyRequest
);
router.delete(
  "/reject-request",
  authenticateUser,
  authorizeRole(["hod"]),
  facultyController.rejectFacultyRequest
);
router.get(
    "/get-faculties",
    authenticateUser,
    authorizeRole(["hod"]),
    facultyController.getFaculties
  );

module.exports = router;