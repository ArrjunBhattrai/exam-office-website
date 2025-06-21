const db = require("../db/db");
const fs = require("fs");
const csv = require("csv-parser");

// Get latest session_id
const getLatestSessionId = async () => {
  const latestSession = await db("session")
    .orderBy("start_year", "desc")
    .orderBy("start_month", "desc")
    .first();

  if (!latestSession) throw new Error("No academic session found");
  return latestSession.session_id;
};

// Uploading student data
const studentDataUpload = async (req, res) => {
  const { branch_id, course_id, specialization, section } = req.body;

  if (!req.file || !branch_id || !course_id || !specialization) {
    return res.status(400).json({
      error: "CSV file and branch_id, course_id, session_id and specialization are required.",
    });
  }

  try {
    // Check if course exists
    const courseExists = await db("course")
      .where({ branch_id, course_id, specialization })
      .first();

    if (!courseExists) {
      return res.status(400).json({
        error:
          "Provided branch, course, and specialization combination does not exist.",
      });
    }

    // If section is provided, check that it exists in the section table
    if (section) {
      const sectionExists = await db("section")
        .where({ branch_id, course_id, specialization, section })
        .first();

      if (!sectionExists) {
        return res.status(400).json({
          error: `Section '${section}' does not exist for the given course under the branch.`,
        });
      }
    } else {
      // If section is not provided, check if any section exists for the course
      const existingSections = await db("section").where({
        branch_id,
        course_id,
        specialization,
      });

      if (existingSections.length > 0) {
        return res.status(400).json({
          error:
            "Section is required since section-wise data exists for the given course.",
        });
      }
    }
    const session_id = await getLatestSessionId();

    const filePath = req.file.path;
    const results = [];

    fs.createReadStream(filePath)
      .pipe(
        csv({ mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/, "") })
      )
      .on("data", (row) => {
        const enrollmentNo = row["Enrollment No"]?.trim();
        const studentName = row["Student Name"]?.trim();
        const semester = parseInt(row["Semester"]);
        const status = row["Status"]?.trim()?.toLowerCase();

        const validStatuses = ["regular", "sem-back", "year-back"];

        if (
          !enrollmentNo ||
          !studentName ||
          isNaN(semester) ||
          !validStatuses.includes(status)
        ) {
          console.warn("Skipping invalid row due to validation:", {
            enrollmentNo,
            studentName,
            semester,
            status,
          });
          return;
        }

        results.push([
          session_id,
          enrollmentNo,
          studentName,
          branch_id,
          course_id,
          specialization,
          section || null,
          semester,
          status,
        ]);
      })
      .on("end", async () => {
        fs.unlinkSync(filePath);

        if (results.length === 0) {
          return res.status(400).json({ error: "No valid data found in CSV." });
        }

        // Check if any of the enrollment numbers already exist for the session
        const enrollmentNos = results.map((r) => r[1]);
        const existing = await db("student")
          .whereIn("enrollment_no", enrollmentNos)
          .andWhere("session_id", session_id);

        const valuesPlaceholders = results
          .map(() => "(?, ?, ?, ?, ?, ?, ?, ?)")
          .join(", ");
        const flatValues = results.flat();
        if (existing.length > 0) {
          return res.status(400).json({
            error: `One or more students already exist for session ${session_id}. Duplicate data not allowed.`,
            duplicates: existing.map((e) => e.enrollment_no),
          });
        }

        // Insert all data
        await db("student").insert(
          results.map((row) => ({
            session_id: row[0],
            enrollment_no: row[1],
            student_name: row[2],
            branch_id: row[3],
            course_id: row[4],
            specialization: row[5],
            section: row[6],
            semester: row[7],
            status: row[8],
          }))
        );

        return res
          .status(200)
          .json({ message: "Student data uploaded successfully!" });
      })
      .on("error", (error) => {
        console.error("CSV Parsing Error:", error.message);
        res.status(500).json({ error: "Error processing CSV file." });
      });
  } catch (err) {
    console.error("Internal error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Get students of a particular course of a branch
const getStudentsForCourse = async (req, res) => {
  const { branch_id, course_id, specialization, semester } = req.query;

  if (!branch_id || !course_id || !specialization || !semester) {
    return res.status(400).json({
      error: "branch_id, course_id, specialization, session_id, and semester are required",
    });
  }

  try {
    const session_id = await getLatestSessionId();

    const students = await db("student")
      .where({
        branch_id,
        course_id,
        specialization,
        semester,
        session_id,
      })
      .select("enrollment_no", "student_name", "status");

    return res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get students enrolled in a subject
const studentBySubject = async (req, res) => {
  try {
    const { subject_id, subject_type, faculty_id } = req.query;

    if (!subject_id || !subject_type || !faculty_id) {
      return res.status(400).json({ error: "Subject ID, type, and faculty ID are required" });
    }

    const session_id = await getLatestSessionId();

    const subject = await db("subject")
      .where({ subject_id, subject_type, session_id })
      .first();

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    const { branch_id, course_id, specialization, semester } = subject;

    // Check for section bifurcation for the course
    const existingSections = await db("section")
      .where({ branch_id, course_id, specialization });

    const isSectioned = existingSections.length > 0;

    // Get sections assigned to this faculty for this subject
    const facultyAssignments = await db("faculty_subject")
      .where({ session_id, subject_id, subject_type, faculty_id })
      .select("section");

    if (facultyAssignments.length === 0) {
      return res.status(403).json({ error: "Unauthorized: Faculty not assigned to this subject" });
    }

    const assignedSections = facultyAssignments.map(row => row.section).filter(Boolean); // only non-null

    if (isSectioned && assignedSections.length === 0) {
      return res.status(400).json({
        error: "Section bifurcation exists but no section is assigned to this faculty",
      });
    }

    let studentsQuery;

    if (subject_type.toLowerCase() === "elective") {
      // Elective students
      studentsQuery = db("elective_data")
        .join("student", function () {
          this.on("elective_data.enrollment_no", "=", "student.enrollment_no")
              .andOn("student.session_id", "=", db.raw("?", [session_id]));
        })
        .where({
          "elective_data.subject_id": subject_id,
          "elective_data.subject_type": subject_type,
          "elective_data.session_id": session_id,
          "student.branch_id": branch_id,
          "student.course_id": course_id,
          "student.specialization": specialization,
          "student.semester": semester,
        });

      if (isSectioned) {
        studentsQuery.whereIn("student.section", assignedSections);
      }

    } else {
      // Regular subject students
      studentsQuery = db("student")
        .where({
          session_id,
          branch_id,
          course_id,
          specialization,
          semester,
        });

      if (isSectioned) {
        studentsQuery.whereIn("section", assignedSections);
      }
    }
    const students = await studentsQuery.select("student.enrollment_no", "student.student_name");
    return res.json(students);
  } catch (err) {
    console.error("Error in studentBySubject:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  studentDataUpload,
  getStudentsForCourse,
  studentBySubject,
};
