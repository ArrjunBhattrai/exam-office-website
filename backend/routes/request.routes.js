const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const requestController = require("../controller/correctionrequest");

router.get(
  "/submitted-form",
  authenticateUser,
  authorizeRole(["faculty"]),
  requestController.getSubmittedForms
);

router.post(
  "/submit-request",
  authenticateUser,
  authorizeRole(["faculty"]),
  requestController.submitCorrectionRequest
);

router.get(
    "/past-requests/:faculty_id",
    authenticateUser,
    authorizeRole(["faculty"]),
    requestController.getPastRequests
);

router.get(
  "/correction-requests",
  authenticateUser,
  authorizeRole(["admin"]),
  requestController.getAllCorrectionRequests
);

router.put(
  "/correction-requests/:request_id/status", 
  authenticateUser,
  authorizeRole(["admin"]),
  requestController.updateRequestStatus
);

module.exports = router;