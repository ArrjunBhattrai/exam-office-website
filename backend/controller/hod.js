const db = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// HOD login
const hodLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hod = await db("hod").where({ email }).first();

    if (!hod || !bcrypt.compareSync(password, hod.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { hod_id: hod.id, department_id: hod.department_id, role: "HOD" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      hod: {
        id: hod.id,
        name: hod.hod_name,
        email: hod.email,
        department_name: hod.department_name,
        course_name: hod.course_name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};

// Get Department Details
const getDepartmentDetails = async (req, res) => {
  try {
    const { department_id } = req.body;
    const { role } = req.user;
    if (role !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    const semesters = await db("semesters").where({ department_id }).select("*");
    res.status(200).json({ department_id, semesters });
  } catch (error) {
    res.status(500).json({ message: "Error fetching department data", error });
  }
};

// Create a new Faculty
const createFaculty = async (req, res) => {
  try {
    const { faculty_name, email, password, branch_id } = req.body;

    // Check if email already exists
    const existingFaculty = await db("faculty").where({ email }).first();
    if (existingFaculty) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert faculty
    const [faculty_id] = await db("faculty").insert({
      faculty_name,
      email,
      password: hashedPassword,
      branch_id,
    });

    res.status(201).json({
      message: "Faculty created successfully",
      faculty: { faculty_id, faculty_name, email, branch_id },
    });
  } catch (error) {
    console.error("Error creating faculty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a Faculty
const deleteFaculty = async (req, res) => {
  try {
    const faculty_id = Number(req.params.faculty_id);

    const faculty = await db("faculty").where({ id: faculty_id }).first();
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    // Remove faculty assignments before deleting
    await db("subject_faculty").where({ faculty_id }).del();

    // Delete faculty
    await db("faculty").where({ id: faculty_id }).del();

    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Assign Faculty to Subject
const assignSubjectToFaculty = async (req, res) => {
  try {
    const { subject_id, faculty_id } = req.body;
    const { role } = req.user;
    if (role !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    await db("subject_faculty").insert({ subject_id, faculty_id });
    res.status(201).json({ message: "Faculty assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error assigning faculty", error });
  }
};

// Remove Faculty from Subject
const removeFacultyFromSubject = async (req, res) => {
  try {
    const { subject_id, faculty_id } = req.body;
    const { role } = req.user;
    if (role !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    await db("subject_faculty").where({ subject_id, faculty_id }).del();
    res.status(200).json({ message: "Faculty removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing faculty", error });
  }
};

// Get Faculty Assigned to a Subject
const getFacultyBySubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    if (role !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    const faculty = await db("subject_faculty")
      .join("faculty", "subject_faculty.faculty_id", "faculty.id")
      .where("subject_faculty.subject_id", id)
      .select("faculty.id", "faculty.faculty_name", "faculty.email");

    res.status(200).json({ faculty });
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty", error });
  }
};

// Exporting functions
module.exports = {
  hodLogin,
  getDepartmentDetails,
  createFaculty,
  deleteFaculty,
  assignSubjectToFaculty,
  removeFacultyFromSubject,
  getFacultyBySubject,
};
