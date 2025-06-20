const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const facultyController = require("../controller/faculty");

router.get(
  "/request",
  authenticateUser,
  authorizeRole(["hod"]),
  facultyController.getPendingFacultyRequests
);
router.post(
  "/request",
  authenticateUser,
  authorizeRole(["hod"]),
  facultyController.approveFacultyRequest
);
router.delete(
  "/request",
  authenticateUser,
  authorizeRole(["hod"]),
  facultyController.rejectFacultyRequest
);
router.get(
    "/",
    authenticateUser,
    authorizeRole(["hod"]),
    facultyController.getFaculties
  );
router.post(
  "/assign",
  authenticateUser,
  authorizeRole(["hod"]),
  facultyController.assignFaculties
);
module.exports = router