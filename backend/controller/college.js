const db = require("../db/db");

// Create College
const createCollege = async (req, res) => {
  try {
    const { college_name } = req.body;
    const { user_type } = req.user;

    if (user_type !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    if (!college_name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [college] = await db("college")
      .insert({ college_name })
      .returning("*");

    res.status(201).json({ data: { college } });
  } catch (error) {
    res.status(500).json({ message: "Error registering college", error });
  }
};

// Get College by ID
const getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Please provide college ID" });
    }

    const college = await db("college").where("college_id", id).first();

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    return res.status(200).json({ data: college });
  } catch (error) {
    console.error("Error fetching college:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Colleges
const getAllColleges = async (req, res) => {
  try {
    const colleges = await db("college").select("*");

    if (!colleges.length) {
      return res.status(404).json({ message: "No colleges found" });
    }

    return res.status(200).json({ data: colleges });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update College
const updateCollege = async (req, res) => {
  try {
    const { college_id, college_name } = req.body;
    const { user_type } = req.user;

    if (user_type !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    if (!college_id || !college_name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [college] = await db("college")
      .where({ college_id })
      .update({ college_name })
      .returning("*");

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.status(200).json({ data: { college } });
  } catch (error) {
    console.error("Error updating college:", error);
    res.status(500).json({ message: "Error updating college", error });
  }
};

// Delete College
const deleteCollege = async (req, res) => {
  try {
    const { college_id } = req.body;
    const { user_type } = req.user;

    if (user_type !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    if (!college_id) {
      return res.status(400).json({ message: "Please provide college ID" });
    }

    const deletedRow = await db("college")
      .where("college_id", college_id)
      .del();

    if (!deletedRow) {
      return res.status(404).json({ message: "College not found" });
    }

    return res.status(200).json({ message: "College deleted successfully" });
  } catch (error) {
    console.error("Error deleting college:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createCollege,
  getCollegeById,
  getAllColleges,
  updateCollege,
  deleteCollege,
};
