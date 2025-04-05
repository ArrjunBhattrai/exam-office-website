const db = require("../db/db");

// Get subjects assigned to the faculty
const assignedSubject = async (req, res) => {
  try {
    const { faculty_id } = req.params;

    if (!faculty_id) {
      return res.status(400).json({ error: "Faculty ID is required" });
    }

    const subjects = await db("faculty_subject")
      .join("subject", function () {
        this.on("faculty_subject.subject_id", "=", "subject.subject_id")
            .andOn("faculty_subject.subject_type", "=", "subject.subject_type");
      })
      .where("faculty_subject.faculty_id", faculty_id)
      .select("subject.subject_id", "subject.subject_type", "subject.subject_name", "subject.semester");

    res.json({ faculty_id, subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Assign COs for a subject
const assignCO = async (req, res) => {
  try {
    const { subject_id, subject_type, co_names } = req.body;

    if (!subject_id || !subject_type || !Array.isArray(co_names) || co_names.length === 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const insertedCOs = await db("course_outcome")
      .insert(co_names.map((name) => ({
        co_name: name,
        subject_id,
        subject_type
      })))
      .returning("*");

    res.json({ message: "COs added successfully", insertedCOs });
  } catch (error) {
    console.error("Error assigning COs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get students enrolled in a subject
const studentBySubject = async (req, res) => {
  try {
    const { subject_id, subject_type } = req.params;

    if (!subject_id || !subject_type) {
      return res.status(400).json({ error: "Subject ID and type are required" });
    }

    const students = await db("student_subject")
      .join("student", "student_subject.enrollment_no", "student.enrollment_no")
      .where({
        "student_subject.subject_id": subject_id,
        "student_subject.subject_type": subject_type
      })
      .select("student.enrollment_no", "student.student_name");

    res.json({ subject_id, subject_type, students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Submit marks of students
const submitMarks = async (req, res) => {
  try {
    const {
      subject_id,
      subject_type,
      component_name,
      sub_component_name,
      marks
    } = req.body;

    if (!subject_id || !subject_type || !component_name || !sub_component_name || !Array.isArray(marks)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const marksData = marks.map(({ enrollment_no, co_name, marks }) => ({
      enrollment_no,
      subject_id,
      subject_type,
      component_name,
      sub_component_name,
      co_name,
      marks
    }));

    await db("marks_temp").insert(marksData);

    res.status(201).json({ message: "Marks submitted successfully" });
  } catch (error) {
    console.error("Error submitting marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get the marks of a particular sub-component
const getStudentMarks = async (req, res) => {
  try {
    const { subject_id, subject_type, component_name, sub_component_name } = req.params;

    if (!subject_id || !subject_type || !component_name || !sub_component_name) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const marksData = await db("marks_temp")
      .join("student", "marks_temp.enrollment_no", "student.enrollment_no")
      .select(
        "student.enrollment_no",
        "student.student_name",
        "marks_temp.co_name",
        "marks_temp.marks"
      )
      .where({
        "marks_temp.subject_id": subject_id,
        "marks_temp.subject_type": subject_type,
        "marks_temp.component_name": component_name,
        "marks_temp.sub_component_name": sub_component_name
      });

    if (marksData.length === 0) {
      return res.status(404).json({ message: "No marks found for given criteria" });
    }

    res.status(200).json({ subject_id, subject_type, component_name, sub_component_name, marks: marksData });
  } catch (error) {
    console.error("Error fetching student marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  assignedSubject,
  assignCO,
  studentBySubject,
  submitMarks,
  getStudentMarks,
};
