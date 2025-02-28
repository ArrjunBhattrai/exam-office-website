const db = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// HOD Login
const hodLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hod = await db("hod").where({ email }).first();
    
    if (!hod || !bcrypt.compareSync(password, hod.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ hod_id: hod.id, department_id: hod.department_id, role: "HOD" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token, hod });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};

// Get Department and Semesters
const getDepartment = async (req, res) => {
  try {
    const { department_id } = req.hod_id;
    
    const semesters = await db("semesters").where({ department_id }).select("*");
    res.status(200).json({ department_id, semesters });
  } catch (error) {
    res.status(500).json({ message: "Error fetching department data", error });
  }
};

// Add a Semester
const addSemester = async (req, res) => {
  try {
    const { department_id } = req.hod_id;
    const { semester_name } = req.body;

    const [semester] = await db("semesters").insert({ department_id, semester_name }).returning("*");
    res.status(201).json({ semester });
  } catch (error) {
    res.status(500).json({ message: "Error adding semester", error });
  }
};

// Update a Semester
const updateSemester = async (req, res) => {
  try {
    const { id } = req.params;
    const { semester_name } = req.body;

    await db("semesters").where({ id }).update({ semester_name });
    res.status(200).json({ message: "Semester updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating semester", error });
  }
};

// Delete a Semester
const deleteSemester = async (req, res) => {
  try {
    const { id } = req.params;
    await db("semesters").where({ id }).del();
    res.status(200).json({ message: "Semester deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting semester", error });
  }
};

// Get Subjects of a Semester
const getSubjectsBySemester = async (req, res) => {
  try {
    const { id } = req.params;
    const subjects = await db("subjects").where({ semester_id: id }).select("*");
    res.status(200).json({ subjects });
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects", error });
  }
};

// Add Subject to Semester
const addSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_name } = req.body;

    const [subject] = await db("subjects").insert({ semester_id: id, subject_name }).returning("*");
    res.status(201).json({ subject });
  } catch (error) {
    res.status(500).json({ message: "Error adding subject", error });
  }
};

// Update Subject
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_name } = req.body;

    await db("subjects").where({ id }).update({ subject_name });
    res.status(200).json({ message: "Subject updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating subject", error });
  }
};

// Delete Subject
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await db("subjects").where({ id }).del();
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subject", error });
  }
};

// Get Faculty Assigned to a Subject
const getFacultyBySubject = async (req, res) => {
  try {
    const { id } = req.params;
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
    await db("subject_faculty").where({ subject_id, faculty_id }).del();
    res.status(200).json({ message: "Faculty removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing faculty", error });
  }
};

module.exports = { hodLogin, getDepartment, addSemester, updateSemester, deleteSemester, getSubjectsBySemester, addSubject, updateSubject, deleteSubject, getFacultyBySubject, assignSubjectToFaculty, removeFacultyFromSubject };
