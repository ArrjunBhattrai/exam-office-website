const db = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Course Related Activities
//Create a new course
const createCourse = async (req, res) => {
  const { course_id, course_name, course_year } = req.body;

  if (!course_id || !course_name || !course_year) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the course already exists
    const existingCourse = await db("course").where({ course_id }).first();

    if (existingCourse) {
      return res.status(409).json({ error: "Course already exists" }); // 409 Conflict
    }
    await db("course").insert({
      course_id,
      course_name,
      course_year,
    });

    res.status(201).json({ message: "Course created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating course" });
  }
};

//Delete a existing course
const deleteCourse = async (req, res) => {
  const { course_id } = req.params; // Get course_id from URL params

  try {
    // Check if the course exists
    const existingCourse = await db("course").where({ course_id }).first();

    if (!existingCourse) {
      return res.status(404).json({ error: "Course not found" }); // 404 Not Found
    }

    // Delete the course
    await db("course").where({ course_id }).del();

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting course" });
  }
};

//Get existing courses
const getCourses = async (req, res) => {
  try {
    const courses = await db("course").select("*");
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching courses" });
  }
};

//Branch related activities
//Create a new branch
const createBranch = async (req, res) => {
  const { branch_id, branch_name, course_id } = req.body;

  try {
    // Check if branch already exists
    const existingBranch = await db("branch").where({ branch_id }).first();
    if (existingBranch) {
      return res.status(400).json({ error: "Branch ID already exists" });
    }

    // Check if the course exists
    const existingCourse = await db("course").where({ course_id }).first();
    if (!existingCourse) {
      return res
        .status(400)
        .json({ error: "Invalid course ID. Course does not exist." });
    }

    // Insert the new branch
    await db("branch").insert({ branch_id, branch_name, course_id });

    res.status(201).json({ message: "Branch created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating branch" });
  }
};

//Delete a existing branch
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

  //Get all existing branches
  const getBranches = async (req, res) => {
    try {
      const branches = await db("branch")
        .join("course", "branch.course_id", "=", "course.course_id")
        .select("branch.*", "course.course_name");
  
      res.status(200).json(branches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching branches" });
    }
  };
  
  

module.exports = { createCourse, deleteCourse, getCourses, createBranch, deleteBranch, getBranches};
