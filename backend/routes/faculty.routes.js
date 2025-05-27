const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const facultyController = require("../controller/faculty");

router.get(
  "/faculty/requests",
  authenticateUser,
  authorizeRole(["hod"]),
  facultyController.getPendingFacultyRequests
);
router.post(
  "/faculty/requests/approve",
  authenticateUser,
  authorizeRole(["hod"]),
  facultyController.approveFacultyRequest
);
router.delete(
  "/faculty/requests/reject",
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
