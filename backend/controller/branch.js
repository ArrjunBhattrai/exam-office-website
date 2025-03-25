const db = require("../db/db");

const createBranch = async (req, res) => {
  try {
    const { branch_name, course_id, hod_officer_id } = req.body;
    const { user_type } = req.user;
    if (user_type !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }
    if (!branch_name || !course_id || !hod_officer_id) {
      return res.status(400).json({
        message: "Branch name, course ID, and HOD officer ID are required",
      });
    }
    const hod_id = await db("hod")
      .select("*")
      .where("officer_id", hod_officer_id)
      .first();

    const [branch_id] = await db("branch").insert({
      branch_name,
      course_id,
      hod_id,
    });

    return res
      .status(201)
      .json({ message: "Branch created successfully", data: { branch_id } });
  } catch (error) {
    console.error("Error creating branch:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { branch_name, course_id } = req.body;
    const { user_type } = req.user;
    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    if (!branch_name && !course_id) {
      return res
        .status(400)
        .json({ message: "Provide at least one field to update" });
    }
    const update = {
      ...(branch_name && { branch_name }),
      ...(course_id && { course_id }),
    };

    const updatedRows = await db("branch")
      .where("branch_id", id)
      .update(update);

    if (!updatedRows) {
      return res.status(404).json({ message: "Branch not found" });
    }

    return res.status(200).json({ message: "Branch updated successfully" });
  } catch (error) {
    console.error("Error updating branch:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await db("branch").where("branch_id", id).del();
    const { user_type } = req.user;
    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    if (!deletedRows) {
      return res.status(404).json({ message: "Branch not found" });
    }

    return res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Error deleting branch:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const assignHod = async (req, res) => {
  try {
    const { id } = req.params;
    const { hod_id } = req.body;
    const { user_type } = req.user;
    if (user_type !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }
    if (!hod_id) {
      return res.status(400).json({ message: "Please provide HOD ID" });
    }

    const updatedRows = await db("branch")
      .where("branch_id", id)
      .update({ hod_id });

    if (!updatedRows) {
      return res.status(404).json({ message: "Branch not found" });
    }

    return res.status(200).json({ message: "HOD assigned successfully" });
  } catch (error) {
    console.error("Error assigning HOD:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllBranches = async (req, res) => {
  try {
    const branches = await db("branch").select("*");

    if (branches.length === 0) {
      return res.status(404).json({ message: "No branches found" });
    }

    return res.status(200).json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;

    const branch = await db("branch").where("branch_id", id).first();

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    return res.status(200).json(branch);
  } catch (error) {
    console.error("Error fetching branch:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createBranch,
  updateBranch,
  deleteBranch,
  assignHod,
  getAllBranches,
  getBranchById,
};
