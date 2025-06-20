const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const atktController = require("../controller/atkt");

router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  upload.single("file"),
  atktController.atktStudentUpload
);
router.get(
  "/get-atkt-students",
  authenticateUser,
  authorizeRole(["faculty"]),
  atktController.getATKTStudentBySubject
);
router.post(
  "/insert-test-details",
  authenticateUser,
  authorizeRole(["faculty"]),
  atktController.insertTestDetails
);
router.get(
  "/fetch-test-details",
  authenticateUser,
  authorizeRole(["faculty"]),
  atktController.fetchTestDetails
);
router.delete(
  "/delete-test-details",
  authenticateUser,
  authorizeRole(["faculty"]),
  atktController.deleteTestDetails
);
router.post(
  "/save-marks",
  authenticateUser,
  authorizeRole(["faculty"]),
  atktController.saveATKTMarks
);
router.post(
  "/submit-marks",
  authenticateUser,
  authorizeRole(["faculty"]),
  atktController.submitATKTMarks
);
router.get(
  "/fetch-atkt-marks-data",
  authenticateUser,
  authorizeRole(["faculty"]),
  atktController.fetchATKTMarksData
);

module.exports = router;