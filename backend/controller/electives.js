const db = require("../db/db");
const fs = require("fs");
const csv = require("csv-parser");

const getElectiveSubject = async (req, res) => {
  const { branch_id } = req.params;
  const session_id = req.session_id;

  if (!branch_id) {
    res.status(400).json({ error: "Branch Id is required" });
  }
  try {
    const electives = await db("subject")
      .where({
        branch_id,
        subject_type: "Elective",
        session_id,
      })
      .select(
        "subject_id",
        "subject_type",
        "subject_name",
        "semester",
        "course_id",
        "specialization"
      );

    res.json(electives);
  } catch (err) {
    console.error("Error fetching electives:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadElectiveData = async (req, res) => {
  const { subject_id, subject_type } = req.body;
  const session_id = req.session_id;
  
  if (!req.file || !subject_id || !subject_type) {
    return res.status(400).json({
      error: "CSV file, subject_id and subject_type are all required.",
    });
  }
  const subj = await db("subject").where({ subject_id, subject_type, session_id }).first();

  if (!subj) {
    return res
      .status(400)
      .json({ error: "Provided subject_id & subject_type do not exist." });
  }

  const filePath = req.file.path;
  const enrollmentNos = new Set();
  let headersChecked = false;
  let headersValid = false;
  fs.createReadStream(filePath)
    .pipe(
      csv({ mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/, "") })
    )
    .on("headers", (headers) => {
      headersChecked = true;
      headersValid = headers.includes("Enrollment No");
      if (!headersValid) {
        fs.unlinkSync(filePath);
        return res.status(400).json({
          error: `Missing or invalid header: 'Enrollment No' not found in CSV.`,
        });
      }
    })
    .on("data", (row) => {
      if (!headersValid) return;
      const id = row["Enrollment No"]?.trim();
      if (id) enrollmentNos.add(id);
    })
    .on("end", async () => {
      if (!headersChecked || !headersValid) return;
      fs.unlinkSync(filePath);

      if (enrollmentNos.size === 0) {
        return res
          .status(400)
          .json({ error: "No valid enrollment numbers in CSV." });
      }

      try {
        const ids = [...enrollmentNos];
        const existingStudents = await db("student")
          .whereIn("enrollment_no", ids)
           .andWhere("session_id", session_id)
          .pluck("enrollment_no");

        const missing = ids.filter((x) => !existingStudents.includes(x));
        if (missing.length) {
          return res.status(400).json({
            error: `These enrollment numbers are not in student table: ${missing.join(
              ", "
            )}`,
          });
        }

        const duplicates = await db("elective_data")
          .where({ subject_id, subject_type, session_id })
          .whereIn("enrollment_no", ids)
          .pluck("enrollment_no");

        if (duplicates.length) {
          return res.status(409).json({
            error: `Selections already exist for these students: ${duplicates.join(
              ", "
            )}`,
          });
        }

        await db.transaction(async (trx) => {
          const rows = ids.map((enr) => ({
            enrollment_no: enr,
            subject_id,
            subject_type,
            session_id,
          }));
          await trx("elective_data").insert(rows);
        });

        return res.status(200).json({ inserted: enrollmentNos.size });
      } catch (err) {
        console.error("Elective upload failed:", err);
        return res.status(500).json({ error: "Internal server error." });
      }
    })
    .on("error", (err) => {
      console.error("CSV parse error:", err);
      return res.status(500).json({ error: "Could not read CSV." });
    });
};

module.exports = {
  getElectiveSubject,
  uploadElectiveData,
};
