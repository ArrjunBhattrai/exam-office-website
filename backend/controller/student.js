const db = require("../db/db");
const fs = require("fs");
const csv = require("csv-parser");

// Uploading student data
const studentDataUpload = async (req, res) => {
  const { branch_id, course_id, specialization } = req.body;

  if (!req.file || !branch_id || !course_id || !specialization) {
    return res.status(400).json({
      error: "CSV file and branch_id, course_id, specialization are required.",
    });
  }

  // Check if the course exists
  try {
    const courseExists = await db("course")
      .where({ branch_id, course_id, specialization })
      .first();

    if (!courseExists) {
      return res.status(400).json({
        error:
          "Provided branch, course, and specialization combination does not exist.",
      });
    }
  } catch (err) {
    console.error("DB error checking course:", err);
    return res.status(500).json({ error: "Internal server error." });
  }

  const results = [];
  const filePath = req.file.path;

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
        enrollmentNo,
        studentName,
        branch_id,
        course_id,
        specialization,
        semester,
        status,
      ]);
    })
    
    .on("end", async () => {
      try {
        if (results.length === 0) {
          fs.unlinkSync(filePath);
          return res.status(400).json({ error: "No valid data found in CSV." });
        }

        // Build raw insert query with ON DUPLICATE KEY UPDATE
        // student columns: enrollment_no, student_name, branch_id, course_id, specialization, semester, status

        const valuesPlaceholders = results
          .map(() => "(?, ?, ?, ?, ?, ?, ?)")
          .join(", ");
        const flatValues = results.flat();

        const rawQuery = `
          INSERT INTO student
            (enrollment_no, student_name, branch_id, course_id, specialization, semester, status)
          VALUES ${valuesPlaceholders}
          ON DUPLICATE KEY UPDATE
            student_name = VALUES(student_name),
            branch_id = VALUES(branch_id),
            course_id = VALUES(course_id),
            specialization = VALUES(specialization),
            semester = VALUES(semester),
            status = VALUES(status)
        `;

        await db.raw(rawQuery, flatValues);

        fs.unlinkSync(filePath);
        res
          .status(200)
          .json({ message: "Student data uploaded successfully!" });
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

// Get students of a particular course of a branch
const getStudentsForCourse = async (req, res) => {
  const { branch_id, course_id, specialization, semester } = req.query;

  if (!branch_id || !course_id || !specialization || !semester) {
    return res.status(400).json({
      error: "branch_id, course_id, specialization, and semester are required",
    });
  }

  try {
    const students = await db("student")
      .where({
        branch_id,
        course_id,
        specialization,
        semester,
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
    const { subject_id, subject_type } = req.params;

    if (!subject_id || !subject_type) {
      return res
        .status(400)
        .json({ error: "Subject ID and type are required" });
    }

    // Get subject details (branch_id and semester)
    const subject = await db("subject")
      .where({ subject_id, subject_type })
      .first();

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Fetch students with matching branch_id and semester
    const students = await db("student")
      .where({
        branch_id: subject.branch_id,
        semester: subject.semester,
      })
      .select("enrollment_no", "student_name");

    res.json({
      subject_id,
      subject_type,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  studentDataUpload,
  getStudentsForCourse,
  studentBySubject,
};
