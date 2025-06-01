const { error } = require("console");
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

// Get assigned subject data
const getAssignedSubject = async (req, res) => {
  try {
    const { faculty_id } = req.query;

    if (!faculty_id) {
      return res.status(400).json({ error: "Faculty ID is required" });
    }

    const subjects = await db("faculty_subject")
      .join("subject", function () {
        this.on("faculty_subject.subject_id", "=", "subject.subject_id").andOn(
          "faculty_subject.subject_type",
          "=",
          "subject.subject_type"
        );
      })
      .leftJoin("course_outcome", function () {
        this.on(
          "faculty_subject.subject_id",
          "=",
          "course_outcome.subject_id"
        ).andOn(
          "faculty_subject.subject_type",
          "=",
          "course_outcome.subject_type"
        );
      })
      .where("faculty_subject.faculty_id", faculty_id)
      .groupBy(
        "subject.subject_id",
        "subject.subject_type",
        "subject.subject_name",
        "subject.semester"
      )
      .select(
        "subject.subject_id",
        "subject.subject_type",
        "subject.subject_name",
        "subject.semester",
        "subject.course_id",
        "subject.specialization",
        db.raw("GROUP_CONCAT(course_outcome.co_name) as co_names")
      );

    const formattedSubjects = subjects.map((subject) => ({
      ...subject,
      co_names: subject.co_names ? subject.co_names.split(",") : [],
    }));

    console.log(formattedSubjects);

    res.status(200).json({ subjects: formattedSubjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
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

const getAllSubjectsForCourse = async (req, res) => {
  const { branch_id, course_id, specialization } = req.query;

  if (!branch_id || !course_id || !specialization) {
    return res.status(400).json({
      error: "branch_id, course_id and specialization are required",
    });
  }

  try {
    const rows = await db("subject as s")
      .leftJoin("faculty_subject as fs", function () {
        this.on("s.subject_id", "=", "fs.subject_id").andOn(
          "s.subject_type",
          "=",
          "fs.subject_type"
        );
      })
      .leftJoin("faculty as f", "fs.faculty_id", "f.faculty_id")
      .where({
        "s.branch_id": branch_id,
        "s.course_id": course_id,
        "s.specialization": specialization,
      })
      .select(
        "s.subject_id",
        "s.subject_name",
        "s.subject_type",
        "s.semester",
        "fs.faculty_id",
        "f.faculty_name"
      )
      .orderBy("s.semester");

    // Group by subject and accumulate faculty info
    const subjectsMap = new Map();

    for (const row of rows) {
      const key = ${row.subject_id}-${row.subject_type};
      if (!subjectsMap.has(key)) {
        subjectsMap.set(key, {
          subject_id: row.subject_id,
          subject_name: row.subject_name,
          subject_type: row.subject_type,
          semester: row.semester,
          faculty_ids: [],
          faculty_names: [],
        });
      }

      const subject = subjectsMap.get(key);
      if (row.faculty_id && !subject.faculty_ids.includes(row.faculty_id)) {
        subject.faculty_ids.push(row.faculty_id);
        subject.faculty_names.push(row.faculty_name);
      }
    }

    return res.status(200).json({ subjects: Array.from(subjectsMap.values()) });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  subjectDataUpload,
  getSubjectsForCourse,
  getAssignedSubject,
  getCourseOutcomes,
  assignCO,
  getAllSubjectsForCourse,
};