const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const electiveController = require("../controller/electives");

router.post(
  "/upload",
  authenticateUser,
  authorizeRole(["hod"]),
  upload.single("file"),
  electiveController.uploadElectiveData
);
router.get(
    "/get-details/:branch_id",
    authenticateUser,
    authorizeRole(["hod"]),
    electiveController.getElectiveSubject
);

module.exports = router;