const express = require("express");
const router = express.Router();
const { authenticate } = require("../util/middleware");
const {
  createCollege,
  updateCollege,
  deleteCollege,
  getCollegeById,
  getAllColleges,
} = require("../controller/college");

// Register Course
router.post("/create", authenticate, createCollege);

router.get("/colleges", authenticate, getAllColleges);

// Update College
router.put("/update/:id", authenticate, updateCollege);

// Delete College
router.delete("/delete/:id", authenticate, deleteCollege);

router.get("/:id", authenticate, getCollegeById);

module.exports = router;
