const db = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Login for faculty
const facultyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hod = await db("faculty").where({ email }).first();

    if (!hod || !bcrypt.compareSync(password, hod.password)) {
      return res
        .status(401)
        .json({ message: "Email and password doesn't match" });
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
    res.status(500).json({ message: "Login error", error });
  }
};

//Get Subjects assigned to the faculty
const subjectByFaculty = async (req, res) => {
  try {
    const { faculty_id } = req.params;
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
    res.status(500).json({ error: "Error fetching subjects" });
  }
};

//Assign COs for a subject
const assignCO = async (req, res) => {
  try {
    const { subject_id, co_names } = req.body;

    if (!subject_id || !Array.isArray(co_names) || co_names.length === 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const insertedCOs = await db("course_outcome").insert(
      co_names.map((name) => ({
        co_name: name,
        subject_id,
      }))
    );

    res.json({ message: "COs added successfully", insertedCOs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get students enrolled in a subject
const studentBySubject = async (req, res) => {
  try {
    const { subject_id } = req.params;
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
    res.status(500).json({ error: "Error fetching students" });
  }
};

//Upload marks 
//For Theoreticals
const saveMarksTheoretical = async (req, res) => {
  try {
    const { marks_Theoretical } = req.body;

    if (!Array.isArray(marks_Theoretical) || marks_Theoretical.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid request. Expected an array of marks." });
    }

    const validComponents = ["CW", "SW", "TH", "PR"];
    const validMarksTheoretical = marks_Theoretical.map((entry) => {
      const {
        student_id,
        subject_id,
        co_id,
        component_name,
        sub_component_name,
      } = entry;

      if (
        !student_id ||
        !subject_id ||
        !co_id ||
        !component_name ||
        !sub_component_name
      ) {
        throw new Error("Missing required fields in some entries.");
      }

      if (!validComponents.includes(component_name)) {
        throw new Error(
          `Invalid component_name '${component_name}'. Allowed: CW, SW, TH, PR`
        );
      }

      return {
        student_id,
        subject_id,
        co_id,
        component_name,
        sub_component_name,
      };
    });

    const insertedMarksTheoretical = await db("marks_temp")
      .insert(validMarksTheoretical)
      .returning("marks_id");

    res.status(201).json({ message: "Marks added successfully", insertedMarksTheoretical });
  } catch (error) {
    console.error("Error inserting marks:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

//For Practicals
const saveMarksPractical = async (req, res) => {
  try {
    const { marks_Practicals } = req.body;

    if (!Array.isArray(marks_Practicals) || marks_Practicals.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid request. Expected an array of marks." });
    }

    const validComponents = ["CW", "SW", "TH", "PR"];
    const validMarksPracticals = marks_Practicals.map((entry) => {
      const {
        student_id,
        subject_id,
        co_id,
        component_name,
        sub_component_name,
      } = entry;

      if (
        !student_id ||
        !subject_id ||
        !co_id ||
        !component_name ||
        !sub_component_name
      ) {
        throw new Error("Missing required fields in some entries.");
      }

      if (!validComponents.includes(component_name)) {
        throw new Error(
          `Invalid component_name '${component_name}'. Allowed: CW, SW, TH, PR`
        );
      }

      return {
        student_id,
        subject_id,
        co_id,
        component_name,
        sub_component_name,
      };
    });

    const insertedMarksPracticals = await db("marks_temp")
      .insert(validMarksPracticals)
      .returning("marks_id");

    res.status(201).json({ message: "Marks added successfully", insertedMarksPracticals });
  } catch (error) {
    console.error("Error inserting marks:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

//SubmitMarks

