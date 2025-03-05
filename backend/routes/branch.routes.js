const express = require("express");
const router = express.Router();
const {
  createBranch,
  updateBranch,
  deleteBranch,
  assignHod,
  getAllBranches,
  getBranchById,
} = require("../controller/branch");

router.post("/", createBranch);
router.get("/branches", getAllBranches);
router.put("/:id/assign-hod", assignHod);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);
router.get("/:id", getBranchById);

module.exports = router;
