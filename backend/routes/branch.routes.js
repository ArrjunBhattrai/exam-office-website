const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth");
const branchController = require("../controller/branch");

router.post(
  "/create-branch",
  authenticateUser,
  authorizeRole(["admin"]),
  branchController.createBranch
);
router.delete(
  "/delete-branch/:branch_id",
  authenticateUser,
  authorizeRole(["admin"]),
  branchController.deleteBranch
);
router.get(
  "/get-branches",
  authenticateUser,
  authorizeRole(["admin"]),
  branchController.getBranches
);
router.patch(
  "/update/:branch_id",
  authenticateUser,
  authorizeRole(["admin"]),
  branchController.updateBranch
);
router.get(
  "/getDetailsByCourse",
  authenticateUser,
  authorizeRole(["hod"]),
  branchController.getBranchDetails
);

module.exports = router;
