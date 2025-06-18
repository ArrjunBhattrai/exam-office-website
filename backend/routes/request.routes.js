const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const requestController = require("../controller/correctionrequest");
const { auth } = require("cassandra-driver");

// router.get(
//   "/submitted-form",
//   authenticateUser,
//   authorizeRole(["faculty"]),
//   requestController.getSubmittedForms
// );

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
  "/form-check",
  authenticateUser,
  authorizeRole(["faculty"]),
  requestController.checkFormExists
);

router.post(
  "/withdraw/:request_id",
  authenticateUser,
  authorizeRole(["faculty"]),
  requestController.withdrawRequest
);

router.post(
  "/proceed/:request_id",
  authenticateUser,
  authorizeRole(["faculty"]),
  requestController.getPastRequests
);

router.post(
  "/form-resubmit",
  authenticateUser,
  authorizeRole(["faculty"]),
  requestController.resubmitForm
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

// router.post("/correction-requests/:request_id/proceed", 
//   authenticateUser,
//   authorizeRole(["admin", "faculty"]),
//   requestController.proceedCorrectionRequest);

module.exports = router;