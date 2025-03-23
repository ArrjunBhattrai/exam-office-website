const db = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Login for faculty
const facultyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request for:", email); // Debug log
    const faculty = await db("faculty").where({ email }).first();
    console.log("Faculty found:", faculty); // Debug log


    if (!faculty) {
      console.log("Invalid email!");
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    let storedPassword = faculty.password;

    // **Check if password is already hashed**
    if (!storedPassword.startsWith("$2a$") && !storedPassword.startsWith("$2b$")) {
      console.log(`Hashing password for faculty ID ${faculty.faculty_id}...`);

      // **Hash the plain text password and update the database**
      const hashedPassword = await bcrypt.hash(storedPassword, 10);
      await db("faculty")
        .where({ faculty_id: faculty.faculty_id })
        .update({ password: hashedPassword });

      storedPassword = hashedPassword; // Update stored password for comparison
    }

    console.log("Stored password:", faculty.password);
    const isPasswordValid = await bcrypt.compare(password, storedPassword);
    console.log("Password match:", isPasswordValid);    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        faculty_id: faculty.faculty_id,
        department_id: faculty.branch_id,
        role: "Faculty",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, faculty });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Subjects assigned to the faculty
const subjectByFaculty = async (req, res) => {
  try {
    const { faculty_id } = req.params;

    if (!faculty_id) {
      return res.status(400).json({ error: "Faculty ID is required" });
    }

    const subjects = await db("faculty_subject")
      .join("subject", "faculty_subject.subject_id", "subject.subject_id")
      .where("faculty_subject.faculty_id", faculty_id)
      .select(
        "subject.subject_id",
        "subject.subject_name",
        "subject.year_semester"
      );

    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Assign COs for a subject
const assignCO = async (req, res) => {
  try {
    const { subject_id, co_names } = req.body;

    if (!subject_id || !Array.isArray(co_names) || co_names.length === 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const insertedCOs = await db("course_outcome")
      .insert(
        co_names.map((name) => ({
          co_name: name,
          subject_id,
        }))
      )
      .returning("*"); // Fetch inserted rows

    res.json({ message: "COs added successfully", insertedCOs });
  } catch (error) {
    console.error("Error assigning COs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get students enrolled in a subject
const studentBySubject = async (req, res) => {
  try {
    const { subject_id } = req.params;

    if (!subject_id) {
      return res.status(400).json({ error: "Subject ID is required" });
    }

    const students = await db("student_subject")
      .join("student", "student_subject.student_id", "student.student_id")
      .where("student_subject.subject_id", subject_id)
      .select(
        "student.student_id",
        "student.student_name",
        "student.enrollment_number"
      );

    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Submit the marks of students
const submitMarks = async (req, res) => {
  try {
    const { subject_id, component_name, sub_component_name, marks } = req.body;

    if (!subject_id || !component_name || !sub_component_name || !Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const marksData = marks.map(({ student_id, co_id, marks }) => ({
      student_id,
      subject_id,
      co_id,
      component_name,
      sub_component_name,
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
    const { subject_id, component_name, sub_component_name } = req.params;

    if (!subject_id || !component_name || !sub_component_name) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const marksData = await db("marks_temp")
      .join("student", "marks_temp.student_id", "student.student_id")
      .select(
        "student.student_id",
        "student.student_name",
        "student.enrollment_number",
        "marks_temp.co_id",
        "marks_temp.marks"
      )
      .where({
        "marks_temp.subject_id": subject_id,
        "marks_temp.component_name": component_name,
        "marks_temp.sub_component_name": sub_component_name
      });

    if (marksData.length === 0) {
      return res.status(404).json({ message: "No marks found for given criteria" });
    }

    res.status(200).json({
      subject_id,
      component_name,
      sub_component_name,
      marks: marksData
    });
  } catch (error) {
    console.error("Error fetching student marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  facultyLogin,
  subjectByFaculty,
  assignCO,
  studentBySubject,
  submitMarks,
  getStudentMarks
};
