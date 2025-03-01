const db = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Get Subjects assigned to the faculty
const subjectByFaculty =  async (req, res) => {
    try {
      const { faculty_id } = req.params;
      const subjects = await db("faculty_subject")
        .join("subject", "faculty_subject.subject_id", "subject.subject_id")
        .where("faculty_subject.faculty_id", faculty_id)
        .select("subject.subject_id", "subject.subject_name", "subject.year_semester");
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: "Error fetching subjects" });
    }
  };

//Get students enrolled in a subject
const studentBySubject = async (req, res) => {
    try {
      const { subject_id } = req.params;
      const students = await db("student_subject")
        .join("student", "student_subject.student_id", "student.student_id")
        .where("student_subject.subject_id", subject_id)
        .select("student.student_id", "student.student_name", "student.enrollment_number");
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Error fetching students" });
    }
  };

  /*//Submit marks for students
  const subitMarks = async (req, res) => {
    try {
      const { faculty_id, subject_id, marks } = req.body;
      if (!faculty_id || !subject_id || !Array.isArray(marks)) {
        return res.status(400).json({ error: "Invalid request format" });
      }
  
      await knex.transaction(async (trx) => {
        for (const mark of marks) {
          const { student_id, co_id, obtained_marks, total_marks } = mark;
          await trx("co_marks_temp").insert({
            student_id,
            subject_id,
            co_id,
            obtained_marks,
            total_marks,
            faculty_id,
            status: "Pending",
          });
        }
      });
  
      res.json({ message: "Marks submitted successfully for verification" });
    } catch (error) {
      res.status(500).json({ error: "Error submitting marks" });
    }
  };*/
  
  