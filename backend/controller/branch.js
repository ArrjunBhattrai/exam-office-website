const db = require("../db/db");

// Create a new branch
const createBranch = async (req, res) => {
  const { branch_id, branch_name } = req.body;

  try {
    // Check if branch already exists
    const existingBranch = await db("branch").where({ branch_id }).first();
    if (existingBranch) {
      return res.status(400).json({ error: "Branch ID already exists" });
    }

    // Insert the new branch
    await db("branch").insert({ branch_id, branch_name });

    res.status(201).json({ message: "Branch created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating branch" });
  }
};



// Deleting a branch
const deleteBranch = async (req, res) => {
  const { branch_id } = req.params;

  try {
    // Check if branch exists
    const existingBranch = await db("branch").where({ branch_id }).first();
    if (!existingBranch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    // Delete the branch
    await db("branch").where({ branch_id }).del();

    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting branch" });
  }
};



// Get all existing branches
const getBranches = async (req, res) => {
  try {
    const branches = await db("branch").select("*");

    res.status(200).json(branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching branches" });
  }
};



// Update branch name
const updateBranch = async (req, res) => {
  const { branch_id } = req.params;
  const { branch_name } = req.body;

  try {
    // Check if the branch exists
    const branch = await db("branch").where({ branch_id }).first();
    if (!branch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    // Update the branch name
    await db("branch").where({ branch_id }).update({ branch_name });

    res.status(200).json({ message: "Branch name updated successfully" });
  } catch (error) {
    console.error("Error updating branch:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Get branch details
const getBranchDetails = async (req, res) => {
  const { branch_id, course_id, specialization, semester } = req.query;

  if (!branch_id || !course_id || !specialization || !semester) {
    return res.status(400).json({
      error: "branch_id, course_id, specialization, and semester are required",
    });
  }

  try {
    // Get all matching subjects
    const subjects = await db("subject")
      .where({
        branch_id,
        course_id,
        specialization,
        semester,
      })
      .select("subject_id", "subject_type", "subject_name");

    // Get all faculty assignments for these subjects
    const subjectIdsAndTypes = subjects.map((s) => ({
      subject_id: s.subject_id,
      subject_type: s.subject_type,
    }));

    const facultyAssignments = await db("faculty_subject as fs")
      .join("faculty as f", "fs.faculty_id", "f.faculty_id")
      .whereIn(
        ["fs.subject_id", "fs.subject_type"],
        subjectIdsAndTypes.map(({ subject_id, subject_type }) => [
          subject_id,
          subject_type,
        ])
      )
      .select(
        "fs.subject_id",
        "fs.subject_type",
        "f.faculty_id",
        "f.faculty_name"
      );

    // Group faculty by subject_id + subject_type
    const facultyMap = {};
    facultyAssignments.forEach((f) => {
      const key = `${f.subject_id}_${f.subject_type}`;
      if (!facultyMap[key]) facultyMap[key] = [];
      facultyMap[key].push({
        faculty_id: f.faculty_id,
        faculty_name: f.faculty_name,
      });
    });

    // Attach faculty list to subjects
    const detailedSubjects = subjects.map((subj) => {
      const key = `${subj.subject_id}_${subj.subject_type}`;
      return {
        ...subj,
        faculty_assigned: facultyMap[key] || [],
      };
    });

    return res.status(200).json({ details: detailedSubjects });
  } catch (error) {
    console.error("Error fetching department details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  createBranch,
  deleteBranch,
  getBranches,
  updateBranch,
  getBranchDetails
};
