const db = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// HOD login
const hodLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch HOD details
    const hod = await db("hod")
      .join("department", "hod.department_id", "department.id")
      .join("course", "department.course_id", "course.id")
      .where({ "hod.email": email })
      .select(
        "hod.*",
        "department.department_name",
        "course.course_name"
      )
      .first();

    if (!hod || !(await bcrypt.compare(password, hod.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { hod_id: hod.id, department_id: hod.department_id, role: "HOD" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return response
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

const getDepartmentDetails = async (req, res) => {
  try {
    const { department_id } = req;

    const department = await db("department")
      .join("course", "department.course_id", "course.id")
      .where({ "department.id": department_id })
      .select("department.*", "course.course_name")
      .first();

    if (!department) {
      return res.status(404).json({ message: "Department not found." });
    }

    res.status(200).json({ department });
  } catch (error) {
    res.status(500).json({ message: "Error fetching department details.", error });
  }
};

const getSemesters = async (req, res) => {
  try {
    const { department_id } = req;

    const semesters = await db("semesters")
      .where({ department_id })
      .select("*");

    res.status(200).json({ semesters });
  } catch (error) {
    res.status(500).json({ message: "Error fetching semesters.", error });
  }
};

const getSubjectsBySemester = async (req, res) => {
  try {
    const { semester_id } = req.params;

    const subjects = await db("subjects")
      .where({ semester_id })
      .select("*");

    res.status(200).json({ subjects });
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects.", error });
  }
};

module.exports = { hodLogin, getDepartmentDetails, getSemesters, getSubjectsBySemester };