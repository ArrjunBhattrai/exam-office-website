const db = require("../db/db");

// Create a course
const createCourse = async (req, res) => {
  const { course_id, course_name, specialization, branch_id } = req.body;

  if (!course_id || !course_name || !specialization || !branch_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if branch exists
    const branchExists = await db("branch").where({ branch_id }).first();
    if (!branchExists) {
      return res.status(404).json({ error: "Branch does not exist" });
    }

    // Check if course already exists with the same course_id, specialization, and branch_id
    const existingCourse = await db("course")
      .where({ course_id, specialization, branch_id })
      .first();

    if (existingCourse) {
      return res.status(409).json({ error: "Course already exists" });
    }

    // Insert the new course
    await db("course").insert({
      course_id,
      course_name,
      specialization,
      branch_id,
    });

    res.status(201).json({ message: "Course created successfully" });
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ error: "Error creating course" });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  const { course_id, branch_id, specialization } = req.query;

  if (!course_id || !branch_id || !specialization) {
    return res
      .status(400)
      .json({ error: "course_id, branch_id, and specialization are required" });
  }

  try {
    const deleted = await db("course")
      .where({ course_id, branch_id, specialization })
      .del();

    if (deleted === 0) {
      return res
        .status(404)
        .json({
          error: `Course with ID '${course_id}' for branch '${branch_id}' and specialization '${specialization}' does not exist`,
        });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete Course Error:", error);
    res.status(500).json({ error: "Error deleting course" });
  }
};

// Get all courses with branch name and specialization
const getCourses = async (req, res) => {
  try {
    const courses = await db("course")
      .join("branch", "course.branch_id", "branch.branch_id")
      .select(
        "course.course_id",
        "course.course_name",
        "course.specialization",
        "branch.branch_id",
        "branch.branch_name"
      );

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Get Courses Error:", error);
    res.status(500).json({ error: "Error retrieving courses" });
  }
};

const getCourseByBranch = async (req, res) => {
  const { branch_id } = req.query;

  if (!branch_id) {
    return res
      .status(400)
      .json({ error: "branch_id is required" });
  }

  try {
    const courses = await db("course")
      .select("*")
      .where({ branch_id });

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Get Course By Branch Error:", error);
    res.status(500).json({ error: "Error fetching courses by branch_id" });
  }
};


module.exports = {
  createCourse,
  deleteCourse,
  getCourses,
  getCourseByBranch
};
