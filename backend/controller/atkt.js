const db = require("../db/db");
const fs = require("fs");
const csv = require("csv-parser");

// Fetch latest session_id
const getLatestSessionId = async () => {
  const latestSession = await db("session")
    .orderBy("start_year", "desc")
    .orderBy("start_month", "desc")
    .first();

  if (!latestSession) throw new Error("No active session found");
  return latestSession.session_id;
};

// Upload atkt data
const atktStudentUpload = async (req, res) => {
  const { branch_id, course_id, specialization } = req.body;

  const expectedHeaders = [
    "Enrollment No",
    "Student Name",
    "Subject ID",
    "Subject Type",
    "Subject Session"
  ];

  if (!req.file || !branch_id || !course_id || specialization === undefined) {
    return res.status(400).json({
      error: "CSV file and branch_id, course_id, specialization are required.",
    });
  }

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
    console.error("DB error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }

  const filePath = req.file.path;
  const results = [];
  const seenSet = new Set();
  let headerError = null;

  try {
    const session_id = await getLatestSessionId();

    const monthMap = {
      jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
      jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
    };

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/, "") }))
        .on("headers", (headers) => {
          const invalidHeaders = expectedHeaders.filter((h) => !headers.includes(h));
          if (invalidHeaders.length > 0) {
            headerError = `Invalid or missing headers: ${invalidHeaders.join(", ")}`;
            return reject(new Error(headerError));
          }
        })
        .on("data", (row) => {
          const enrollment_no = row["Enrollment No"]?.trim();
          const student_name = row["Student Name"]?.trim();
          const subject_id = row["Subject ID"]?.trim();
          const subject_type = row["Subject Type"]?.trim();
          const subject_session_str = row["Subject Session"]?.trim();

          if (!enrollment_no || !student_name || !subject_id || !subject_type || !subject_session_str) return;

          const key = `${enrollment_no}|${subject_id}|${subject_type}`;
          if (seenSet.has(key)) return;
          seenSet.add(key);

          const match = subject_session_str.match(/^(\w+) (\d{4}) - (\w+) (\d{4})$/i);
          if (!match) return;

          const [_, startMonthStr, startYearStr, endMonthStr, endYearStr] = match;
          const start_month = monthMap[startMonthStr.toLowerCase()];
          const start_year = parseInt(startYearStr);
          const end_month = monthMap[endMonthStr.toLowerCase()];
          const end_year = parseInt(endYearStr);

          if (!start_month || !start_year || !end_month || !end_year) return;

          results.push({
            session_id,
            enrollment_no,
            student_name,
            branch_id,
            course_id,
            specialization,
            subject_id,
            subject_type,
            subject_session_data: { start_month, start_year, end_month, end_year }
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (results.length === 0) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({ error: "No valid or unique data in CSV." });
    }

    for (const entry of results) {
      const ss = await db("session")
        .where(entry.subject_session_data)
        .first();

      if (!ss) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(400).json({
          error: `Session not found for subject session: ${entry.subject_session_data.start_month}/${entry.subject_session_data.start_year} - ${entry.subject_session_data.end_month}/${entry.subject_session_data.end_year}`
        });
      }

      entry.subject_session = ss.session_id;
      delete entry.subject_session_data;
    }

    const duplicateQuery = db("atkt_students").where("session_id", session_id);
    results.forEach((r, i) => {
      const clause = {
        enrollment_no: r.enrollment_no,
        subject_id: r.subject_id,
        subject_type: r.subject_type,
      };
      if (i === 0) duplicateQuery.andWhere(clause);
      else duplicateQuery.orWhere(clause);
    });

    const existing = await duplicateQuery;

    if (existing.length > 0) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(409).json({
        error: "Upload failed: Some entries already exist for the latest session.",
        duplicates: existing.map((e) => ({
          enrollment_no: e.enrollment_no,
          subject_id: e.subject_id,
          subject_type: e.subject_type,
        })),
      });
    }

    await db("atkt_students").insert(results);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(200).json({ message: "ATKT student data uploaded successfully!" });
  } catch (err) {
    console.error("Processing error:", err.message || err);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(400).json({
      error: headerError || "Error processing CSV file.",
    });
  }
};

// Get ATKT students for  subject
const getATKTStudentBySubject = async (req, res) => {
  const { subject_id, subject_type } = req.query;

  if (!subject_id || !subject_type) {
    return res
      .status(400)
      .json({ error: "subject_id and subject_type are required." });
  }

  try {
    const session_id = await getLatestSessionId();

    const students = await db("atkt_students")
      .select(
        "enrollment_no",
        "student_name",
        "branch_id",
        "course_id",
        "specialization"
      )
      .where({
        session_id,
        subject_id,
        subject_type,
      });

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching ATKT students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Inseing the max marks CO wise
const insertTestDetails = async (req, res) => {
  const { subject_id, subject_type, co_marks } = req.body;

  if (!subject_id || !subject_type || !co_marks) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const session_id = await getLatestSessionId();

    const insertData = co_marks.map(({ co_name, max_marks }) => ({
      session_id,
      subject_id,
      subject_type,
      co_name,
      max_marks,
    }));

    await db("atkt_test_details").insert(insertData);
    return res.status(201).json({ message: "Max marks inserted successfully" });
  } catch (error) {
    console.error("Error inserting test details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Checking if test details exist or not
const fetchTestDetails = async (req, res) => {
  const { subject_id, subject_type } = req.query;

  if (!subject_id || !subject_type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const session_id = await getLatestSessionId();

    const existingRecords = await db("atkt_test_details").where({
      subject_id,
      subject_type,
      session_id,
    });

    if (existingRecords.length > 0) {
      const coMarks = existingRecords.map((record) => ({
        co_name: record.co_name,
        max_marks: record.max_marks,
      }));

      return res.status(200).json({
        exists: true,
        co_marks: coMarks,
      });
    }

    return res.status(200).json({ exists: false });
  } catch (error) {
    console.error("Error checking test details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteTestDetails = async (req, res) => {
  const { subject_id, subject_type } = req.query;

  if (!subject_id || !subject_type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const deletedRows = await db("atkt_test_details")
      .where({
        subject_id,
        subject_type,
      })
      .del();

    if (deletedRows > 0) {
      return res
        .status(200)
        .json({ message: "Test details deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "No matching test details found" });
    }
  } catch (error) {
    console.error("Error deleting test details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Saving ATKT Marks
const saveATKTMarks = async (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res
        .status(400)
        .json({ error: "Invalid input format, expected array" });
    }

    const session_id = await getLatestSessionId();
    const rowsToUpsert = [];

    for (const entry of data) {
      const { enrollment_no, subject_id, subject_type, co_marks } = entry;

      if (
        !enrollment_no ||
        !subject_id ||
        !subject_type ||
        typeof co_marks !== "object"
      ) {
        return res
          .status(400)
          .json({ error: "Missing required fields or invalid co_marks" });
      }

      const isATKT = await db("atkt_students")
        .where({
          enrollment_no,
          subject_id,
          subject_type,
          session_id,
        })
        .first();

      if (!isATKT) {
        return res.status(403).json({
          error: `Enrollment No: ${enrollment_no} is not marked as ATKT for this subject`,
        });
      }

      for (const [co_name, marks_obtained] of Object.entries(co_marks)) {
        rowsToUpsert.push({
          session_id,
          enrollment_no,
          subject_id,
          subject_type,
          co_name,
          marks_obtained,
          status: "saved",
        });
      }
    }

    for (const row of rowsToUpsert) {
      await db("atkt_marks")
        .insert(row)
        .onConflict([
          "session_id",
          "enrollment_no",
          "subject_id",
          "subject_type",
          "co_name",
        ])
        .merge({
          marks_obtained: row.marks_obtained,
          status: row.status,
        });
    }

    res.status(200).json({ message: "ATKT Marks saved successfully" });
  } catch (error) {
    console.error("Error saving ATKT marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Submit marks of atkt students
const submitATKTMarks = async (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: "Invalid or empty input array" });
    }

    const { subject_id, subject_type } = data[0];
    if (!subject_id || !subject_type) {
      return res.status(400).json({ error: "Missing subject/component identifiers" });
    }

    const session_id = await getLatestSessionId();
    const rowsToInsert = [];

    for (const entry of data) {
      const { enrollment_no, co_marks } = entry;

      if (!enrollment_no || typeof co_marks !== "object" || Array.isArray(co_marks)) {
        return res.status(400).json({ error: "Invalid entry in input data" });
      }

      for (const [co_name, marks_obtained] of Object.entries(co_marks)) {
        if (!co_name || typeof marks_obtained !== "number") {
          return res.status(400).json({ error: "Invalid CO or marks format" });
        }

        rowsToInsert.push({
          session_id,
          enrollment_no,
          subject_id,
          subject_type,
          co_name,
          marks_obtained,
          status: "submitted",
        });
      }
    }

    await db("atkt_marks")
      .where({ subject_id, subject_type, session_id })
      .del();

    await db("atkt_marks").insert(rowsToInsert);

    res.status(200).json({ message: "Marks submitted successfully" });
  } catch (error) {
    console.error("Error submitting marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Check if marks exist
const fetchATKTMarksData = async (req, res) => {
  const { subject_id, subject_type } = req.query;

  if (!subject_id || !subject_type) {
    return res.status(400).json({
      error: "Subject ID, Subject Type are required",
    });
  }

  try {
    const session_id = await getLatestSessionId();

    const submittedRow = await db("atkt_marks")
      .where({ subject_id, subject_type, session_id })
      .andWhere("status", "submitted")
      .first();

    if (submittedRow) {
      return res.status(200).json({
        status: "submitted",
        message: `Marks for ${subject_id} - ${subject_type} have already been submitted.`,
      });
    }

    const savedMarks = await db("atkt_marks")
      .select("enrollment_no", "co_name", "marks_obtained")
      .where({ subject_id, subject_type, session_id, status: "saved" });

    if (savedMarks.length > 0) {
      const testDetails = await db("atkt_test_details")
        .select("co_name", "max_marks")
        .where({ subject_id, subject_type, session_id });

      return res.status(200).json({
        status: "saved",
        saved_marks: savedMarks,
        test_details: testDetails,
        message: "Saved marks and test details found.",
      });
    }

    return res.status(200).json({
      status: "not_found",
      message: "No saved or submitted data found for the selected inputs.",
    });
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  atktStudentUpload,
  getATKTStudentBySubject,
  insertTestDetails,
  fetchTestDetails,
  deleteTestDetails,
  saveATKTMarks,
  submitATKTMarks,
  fetchATKTMarksData,
};
