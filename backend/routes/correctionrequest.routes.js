const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const requestController = require("../controller/correctionrequest");

router.post(
  "/",
  authenticateUser,
  authorizeRole(["faculty"]),
  requestController.submitCorrectionRequest
);

router.get(
    "/",
    authenticateUser,
    authorizeRole(["admin","faculty"]),
    requestController.getCorrectionRequests
);

router.patch(
  "/:request_id", 
  authenticateUser,
  authorizeRole(["admin"]),
  requestController.updateRequestStatus
);

router.delete(
  "/:request_id",
  authenticateUser,
  authorizeRole(["faculty"]),
  requestController.withdrawRequest
);

router.get(
  "/check",
  authenticateUser,
  authorizeRole(["faculty"]),
  requestController.checkFormExists
);

router.get(
  "/marks",
  authenticateUser,
  authorizeRole(["faculty"]),
  requestController.fetchMarksData
);

router.patch(
  "/resubmit",
  authenticateUser,
  authorizeRole(["faculty"]),
  requestController.resubmitForm
);


module.exports = router;