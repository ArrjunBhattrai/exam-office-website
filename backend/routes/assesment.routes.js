const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const assesmentController = require("../controller/assesment");

router.post(
  "/test-details",
  authenticateUser,
  authorizeRole(["faculty"]),
  assesmentController.insertTestDetails
);
router.get(
  "/test-details",
  authenticateUser,
  authorizeRole(["faculty"]),
  assesmentController.fetchTestDetails
);
router.delete(
  "/test-details",
  authenticateUser,
  authorizeRole(["faculty"]),
  assesmentController.deleteTestDetails
);
router.post(
  "/save-marks",
  authenticateUser,
  authorizeRole(["faculty"]),
  assesmentController.saveMarks
);
router.post(
  "/submit-marks",
  authenticateUser,
  authorizeRole(["faculty"]),
  assesmentController.submitMarks
);
router.get(
  "/marks",
  authenticateUser,
  authorizeRole(["faculty"]),
  assesmentController.fetchMarksData
);

module.exports = router;
