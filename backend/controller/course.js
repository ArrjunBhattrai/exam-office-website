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
      return res.status(404).json({
        error: `Course with ID '${course_id}' for branch '${branch_id}' and specialization '${specialization}' does not exist`,
      });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete Course Error:", error);
    res.status(500).json({ error: "Error deleting course" });
  }
};

// Get courses with branch name and specialization(all branch data for admin and specific branch data for hod)
const getCourses = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userBranchId = req.user.branchId;
    const queryBranchId = req.query.branch_id;
    
    let query = db("course")
      .join("branch", "course.branch_id", "branch.branch_id")
      .select(
        "course.course_id",
        "course.course_name",
        "course.specialization",
        "branch.branch_id",
        "branch.branch_name"
      );

    if (userRole === "hod") {
      if (!userBranchId) {
        return res.status(400).json({ error: "Branch ID not found for HOD" });
      }
      query = query.where("course.branch_id", userBranchId);
    } else if (userRole === "admin" && queryBranchId) {
      query = query.where("course.branch_id", queryBranchId);
    }

    const courses = await query;
    console.log(courses);

    // Fetch all sections relevant to the returned courses
    const allSections = await db("section")
      .select("branch_id", "course_id", "specialization", "section");

    // Organize sections into a map for fast lookup
    const sectionMap = {};
    for (const sec of allSections) {
      const key = `${sec.branch_id}-${sec.course_id}-${sec.specialization}`;
      if (!sectionMap[key]) sectionMap[key] = [];
      sectionMap[key].push(sec.section);
    }

    // Append sections to each course
    const coursesWithSections = courses.map((course) => {
      const key = `${course.branch_id}-${course.course_id}-${course.specialization}`;
      return {
        ...course,
        sections: sectionMap[key] || ["No Sections Created"], // array of sections or empty
      };
    });

    return res.status(200).json({ courses: coursesWithSections });
  } catch (error) {
    console.error("Get Courses Error:", error);
    return res.status(500).json({ error: "Error retrieving courses" });
  }
};

module.exports = {
  createCourse,
  deleteCourse,
  getCourses,
};
