const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const branchController = require("../controller/branch");

router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  branchController.createBranch
);
router.get(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  branchController.getBranches
);
router.delete(
  "/:branch_id",
  authenticateUser,
  authorizeRole(["admin"]),
  branchController.deleteBranch
);
router.patch(
  "/update/:branch_id",
  authenticateUser,
  authorizeRole(["admin"]),
  branchController.updateBranch
);
router.get(
  "/get-details-by-course",
  authenticateUser,
  authorizeRole(["hod"]),
  branchController.getBranchDetails
);

module.exports = router;
