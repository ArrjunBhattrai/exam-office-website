const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const assesmentController = require("../controller/assesment");

router.post(
  "/insert-test-details",
  authenticateUser,
  authorizeRole(["faculty"]),
  assesmentController.insertTestDetails
);
router.get(
  "/fetchTestDetails",
  authenticateUser,
  authorizeRole(["faculty"]),
  assesmentController.fetchTestDetails
);
router.delete(
  "/deleteTestDetails",
  authenticateUser,
  authorizeRole(["faculty"]),
  assesmentController.deleteTestDetails
);
router.post(
  "/saveMarks",
  authenticateUser,
  authorizeRole(["faculty"]),
  assesmentController.saveMarks
);
router.post(
  "/submitMarks",
  authenticateUser,
  authorizeRole(["faculty"]),
  assesmentController.submitMarks
);
router.get(
  "/fetchMarksData",
  authenticateUser,
  authorizeRole(["faculty"]),
  assesmentController.fetchMarksData
);

module.exports = router;
