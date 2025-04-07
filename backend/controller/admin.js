const db = require("../db/db");
const csv = require("csv-parser");
const fs = require("fs");

//Course Related Activities
//Create a new course
const createCourse = async (req, res) => {
  const { course_id, course_name, no_of_semester } = req.body;

  if (!course_id || !course_name || !no_of_semester) {
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
      no_of_semester,
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

//Get branch of a particular course
const getBranchesByCourseId = async (req, res) => {
  const { course } = req.query;
  if (!course) return res.status(400).json({ error: "Course is required" });

  try {
    const branches = await db("branch")
      .select("branch_id", "branch_name")
      .where("course_id", course);

    return res.json({ branches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching branches" });
  }
};

//Upload Academic Scheme
const academicSchemeUpload = (req, res) => {
  const branchId = req.body.branch_id;

  if (!req.file || !branchId) {
    return res
      .status(400)
      .json({ error: "CSV file and branch_id are required." });
  }
  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(
      csv({ mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/, "") })
    )
    .on("data", (row) => {
      const subjectId = row["Subject Id"]?.trim();
      const subjectName = row["Subject Name"]?.trim();
      const subjectType = row["Subject Type"]?.trim();
      const semester = parseInt(row["Semester"]);

      if (!subjectId || !subjectName || !subjectType || isNaN(semester)) return;

      results.push({
        subject_id: subjectId,
        subject_name: subjectName,
        subject_type: subjectType,
        semester,
        branch_id: branchId,
      });
    })
    .on("end", async () => {
      try {
        if (results.length === 0) {
          fs.unlinkSync(filePath);
          return res.status(400).json({ error: "No valid data found in CSV." });
        }

        await db("subject").insert(results);
        fs.unlinkSync(filePath);
        res
          .status(200)
          .json({ message: "Academic scheme uploaded successfully!" });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "DB Insert failed", error: err.message });
      }
    })
    .on("error", (error) => {
      console.error("CSV Parsing Error:", error.message);
      res.status(500).json({ error: "Error processing CSV file." });
    });
};

//Upload Student Data
const studentDataUpload = (req, res) => {
  const branchId = req.body.branch_id;

  if (!req.file || !branchId) {
    return res
      .status(400)
      .json({ error: "CSV file and branch_id are required." });
  }
  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(
      csv({ mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/, "") })
    )
    .on("data", (row) => {
      const enrollmentNo = row["Enrollment No."]?.trim();
      const studentName = row["Student Name"]?.trim();
      const semester = parseInt(row["Semester"]);
      
      console.log(enrollmentNo);
      if (!enrollmentNo || !studentName || isNaN(semester)) {
        console.log("file is not as per the requirement");
        return;
      }

      results.push({
        enrollment_no: enrollmentNo,
        student_name: studentName,
        branch_id: branchId,
        semester,
      });
    })
    .on("end", async () => {
      try {
        if (results.length === 0) {
          fs.unlinkSync(filePath);
          return res.status(400).json({ error: "No valid data found in CSV." });
        }

        await db("student").insert(results);
        fs.unlinkSync(filePath);
        res
          .status(200)
          .json({ message: "Student Data uploaded successfully!" });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "DB Insert failed", error: err.message });
      }
    })
    .on("error", (error) => {
      console.error("CSV Parsing Error:", error.message);
      res.status(500).json({ error: "Error processing CSV file." });
    });
};

module.exports = {
  createCourse,
  deleteCourse,
  getCourses,
  getBranchesByCourseId,
  createBranch,
  deleteBranch,
  getBranches,
  academicSchemeUpload,
  studentDataUpload,
};
