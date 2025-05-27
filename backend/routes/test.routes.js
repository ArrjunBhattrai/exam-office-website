const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const testController = require("../controller/test");

router.post(
  "/insert-test-details",
  authenticateUser,
  authorizeRole(["faculty"]),
  testController.insertTestDetails
);
router.post(
  "/check-test-details",
  authenticateUser,
  authorizeRole(["faculty"]),
  test.checkTestDetailsExists
);
router.post(
  "/delete-test-details",
  authenticateUser,
  authorizeRole(["faculty"]),
  test.deleteTestDetails
);
router.post(
  "/saveMarks",
  authenticateUser,
  authorizeRole(["faculty"]),
  facultyController.submitMarks
);

module.exports = router;
