const db = require("../db/db");
const csv = require("csv-parser");
const fs = require("fs");

// Upload subject data
const subjectDataUpload = async (req, res) => {
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
      const subjectId = row["Subject Id"]?.trim();
      const subjectName = row["Subject Name"]?.trim();
      const subjectType = row["Subject Type"]?.trim();
      const semester = parseInt(row["Semester"]);

      if (!subjectId || !subjectName || !subjectType || isNaN(semester)) return;

      results.push([
        subjectId,
        subjectType,
        subjectName,
        semester,
        branch_id,
        course_id,
        specialization,
      ]);
    })
    .on("end", async () => {
      try {
        if (results.length === 0) {
          fs.unlinkSync(filePath);
          return res.status(400).json({ error: "No valid data found in CSV." });
        }

        // Build raw insert query with ON DUPLICATE KEY UPDATE
        // subject columns: subject_id, subject_type, subject_name, semester, branch_id, course_id, specialization

        const valuesPlaceholders = results
          .map(() => "(?, ?, ?, ?, ?, ?, ?)")
          .join(", ");

        const flatValues = results.flat();

        const rawQuery = `
            INSERT INTO subject 
              (subject_id, subject_type, subject_name, semester, branch_id, course_id, specialization)
            VALUES ${valuesPlaceholders}
            ON DUPLICATE KEY UPDATE
              subject_name = VALUES(subject_name),
              semester = VALUES(semester),
              branch_id = VALUES(branch_id),
              course_id = VALUES(course_id),
              specialization = VALUES(specialization)
          `;

        await db.raw(rawQuery, flatValues);

        fs.unlinkSync(filePath);
        res
          .status(200)
          .json({ message: "Academic scheme uploaded successfully!" });
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

// Get subjects for particular course of a branch
const getSubjectsForCourse = async (req, res) => {
  const { branch_id, course_id, specialization, semester } = req.query;

  if (!branch_id || !course_id || !specialization || !semester) {
    return res.status(400).json({
      error: "branch_id, course_id, specialization, and semester are required",
    });
  }

  try {
    const subjects = await db("subject")
      .where({
        branch_id,
        course_id,
        specialization,
        semester,
      })
      .select("subject_id", "subject_name", "subject_type");

    return res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get subjects assigned to a faculty
const getFacultySubjects = async (req, res) => {
  const { faculty_id } = req.params;

  try {
    if (!faculty_id) {
      return res.status(400).json({ error: "Faculty ID is required" });
    }

    const subjects = await db("faculty_subject as fs")
      .join("subject as s", function () {
        this.on("fs.subject_id", "=", "s.subject_id").andOn(
          "fs.subject_type",
          "=",
          "s.subject_type"
        );
      })
      .where("fs.faculty_id", faculty_id)
      .select("fs.subject_id", "fs.subject_type", "s.subject_name");

    return res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error fetching faculty subjects:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get assigned subject data with COs and assignment type
const getAssignedSubjectDetails = async (req, res) => {
  try {
    const { faculty_id } = req.params;

    if (!faculty_id) {
      return res.status(400).json({ error: "Faculty ID is required" });
    }

    const subjects = await db("faculty_subject as fs")
      .join("subject as s", function () {
        this.on("fs.subject_id", "=", "s.subject_id").andOn(
          "fs.subject_type",
          "=",
          "s.subject_type"
        );
      })
      .leftJoin("course_outcome as co", function () {
        this.on("fs.subject_id", "=", "co.subject_id").andOn(
          "fs.subject_type",
          "=",
          "co.subject_type"
        );
      })
      .where("fs.faculty_id", faculty_id)
      .groupBy(
        "fs.subject_id",
        "fs.subject_type",
        "s.subject_name",
        "s.semester",
        "s.branch_id",
        "s.course_id",
        "s.specialization",
        "fs.assignment_type"
      )
      .select(
        "fs.subject_id",
        "fs.subject_type",
        "s.subject_name",
        "s.semester",
        "s.branch_id",
        "s.course_id",
        "s.specialization",
        "fs.assignment_type",
        db.raw("GROUP_CONCAT(co.co_name ORDER BY co.co_name) as co_names")
      );

    const formattedSubjects = subjects.map((subject) => ({
      ...subject,
      co_names: subject.co_names ? subject.co_names.split(",") : [],
    }));

    res.status(200).json({ subjects: formattedSubjects });
  } catch (error) {
    console.error("Error fetching assigned subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get COs for a subject
const getCourseOutcomes = async (req, res) => {
  try {
    const { subject_id, subject_type } = req.params;

    if (!subject_id || !subject_type) {
      return res
        .status(400)
        .json({ error: "Subject ID and Subject Type are required." });
    }

    const coList = await db("course_outcome")
      .where({ subject_id, subject_type })
      .pluck("co_name");

    res.status(200).json(coList);
  } catch (error) {
    console.error("Error fetching COs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Assign COs for a subject
const assignCO = async (req, res) => {
  try {
    const { subject_id, subject_type, co_names } = req.body;

    if (
      !subject_id ||
      !subject_type ||
      !Array.isArray(co_names) ||
      co_names.length === 0
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const insertedCOs = await db("course_outcome").insert(
      co_names.map((name) => ({
        co_name: name,
        subject_id,
        subject_type,
      }))
    );

    res.status(200).json({ message: "COs added successfully", insertedCOs });
  } catch (error) {
    console.error("Error assigning COs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  subjectDataUpload,
  getSubjectsForCourse,
  getFacultySubjects,
  getAssignedSubjectDetails,
  getCourseOutcomes,
  assignCO,
};
