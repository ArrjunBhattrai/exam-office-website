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
    const { department_id } = req.body;
    const { user_type } = req.user;
    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    const semesters = await db("semesters")
      .where({ department_id })
      .select("*");
    res.status(200).json({ department_id, semesters });
  } catch (error) {
    res.status(500).json({ message: "Error fetching department data", error });
  }
};

// Add a Semester
const addSemester = async (req, res) => {
  try {
    const { semester_name, department_id } = req.body;
    const { user_type } = req.user;
    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    const [semester] = await db("semesters")
      .insert({ department_id, semester_name })
      .returning("*");
    res.status(201).json({ semester });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching department details.", error });
  }
};

const getSemesters = async (req, res) => {
  try {
    const { id } = req.params;
    const { semester_name, year_semester, branch_id } = req.body;
    const { user_type } = req.user;
    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    const update = {
      ...(semester_name && { semester_name }),
      ...(year_semester && { year_semester }),
      ...(branch_id && { branch_id }),
    };

    await db("semesters").where({ id }).update(update);
    res.status(200).json({ message: "Semester updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating semester", error });
  }
};

// Delete a Semester
const deleteSemester = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_type } = req.user;
    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    if (!id) {
      return res.status(400).json({ message: "Semester ID is required" });
    }
    await db("semesters").where({ id }).del();
    res.status(200).json({ message: "Semester deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching semesters.", error });
  }
};

const getSubjectsBySemester = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_type } = req.user;
    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    const subjects = await db("subjects")
      .where({ semester_id: id })
      .select("*");
    res.status(200).json({ subjects });
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects.", error });
  }
};

// Add Subject to Semester
const addSubject = async (req, res) => {
  try {
    const { subject_name, year_semester, branch_id } = req.body;
    const { user_type } = req.user;
    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    const [subject] = await db("subjects")
      .insert({ subject_name, year_semester, branch_id })
      .returning("*");
    res.status(201).json({ subject });
  } catch (error) {
    res.status(500).json({ message: "Error adding subject", error });
  }
};

// Update Subject
const updateSubject = async (req, res) => {
  try {
    const { user_type } = req.user;
    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { subject_id, subject_name, year_semester, branch_id } = req.body;
    const update = {
      subject_id,
      ...(subject_name && { subject_name }),
      ...(year_semester && { year_semester }),
      ...(branch_id && { branch_id }),
    };
    await db("subjects").where({ id }).update(update);
    res.status(200).json({ message: "Subject updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating subject", error });
  }
};

// Delete Subject
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject_id = id;
    const { user_type } = req.user;
    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    if (!subject_id) {
      return res.status(400).json({ message: "Subject ID is required" });
    }
    await db("subjects").where({ subject_id }).del();
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subject", error });
  }
};

// Get Faculty Assigned to a Subject
const getFacultyBySubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_type } = req.user;
    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    const faculty = await db("subject_faculty")
      .join("faculty", "subject_faculty.faculty_id", "faculty.id")
      .where("subject_faculty.subject_id", id)
      .select("faculty.id", "faculty.name", "faculty.email");

    res.status(200).json({ faculty });
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty", error });
  }
};

// Assign Faculty to Subject
const assignSubjectToFaculty = async (req, res) => {
  try {
    const { subject_id, faculty_id } = req.body;
    const { user_type } = req.user;

    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }

    const inserted = await db("subject_faculty").insert({ subject_id, faculty_id });

    if(inserted) {
      res.status(201).json({ message: "Faculty assigned successfully" });
    } else {
      return res.status(500).json({ message: "Failed to assign faculty" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error assigning faculty", error });
  }
};

// Remove Faculty from Subject
const removeFacultyFromSubject = async (req, res) => {
  try {
    const { subject_id, faculty_id } = req.body;
    const { user_type } = req.user;
    if (user_type !== "HOD") {
      return res.status(403).json({ message: "Access denied" });
    }
    await db("subject_faculty").where({ subject_id, faculty_id }).del();
    res.status(200).json({ message: "Faculty removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing faculty", error });
  }
};

module.exports = {
  hodLogin,
  getDepartmentDetails,
  getSemesters,
  addSemester,
  // updateSemester,
  deleteSemester,
  getSubjectsBySemester,
  addSubject,
  updateSubject,
  deleteSubject,
  getFacultyBySubject,
  assignSubjectToFaculty,
  removeFacultyFromSubject,
};
