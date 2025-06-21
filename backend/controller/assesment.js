const db = require("../db/db");

// Get latest session_id
const getLatestSessionId = async () => {
  const latestSession = await db("session")
    .orderBy("start_year", "desc")
    .orderBy("start_month", "desc")
    .first();

  if (!latestSession) throw new Error("No academic session found");
  return latestSession.session_id;
};

//Inseing the max marks CO wise
const insertTestDetails = async (req, res) => {
  const {
    subject_id,
    subject_type,
    component_name,
    sub_component_name,
    co_marks,
  } = req.body;

  if (
    !subject_id ||
    !subject_type ||
    !component_name ||
    !sub_component_name ||
    !co_marks
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const session_id = await getLatestSessionId();

    const insertData = co_marks.map(({ co_name, max_marks }) => ({
      subject_id,
      subject_type,
      component_name,
      sub_component_name,
      co_name,
      max_marks,
      session_id,
    }));

    await db("test_details").insert(insertData);

    return res.status(201).json({ message: "Max marks inserted successfully" });
  } catch (error) {
    console.error("Error inserting test details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Checking if test details exist or not
const fetchTestDetails = async (req, res) => {
  const { subject_id, subject_type, component_name, sub_component_name } =
    req.query;

  if (!subject_id || !subject_type || !component_name || !sub_component_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const session_id = await getLatestSessionId();

    const existingRecords = await db("test_details").where({
      subject_id,
      subject_type,
      component_name,
      sub_component_name,
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

// Delete test details
const deleteTestDetails = async (req, res) => {
  const { subject_id, subject_type, component_name, sub_component_name } =
    req.query;

  if (!subject_id || !subject_type || !component_name || !sub_component_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const session_id = await getLatestSessionId();

    const deletedRows = await db("test_details")
      .where({
        session_id,
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
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

// Saving Marks
const saveMarks = async (req, res) => {
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
      const {
        enrollment_no,
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
        co_marks,
      } = entry;

      if (
        !enrollment_no ||
        !subject_id ||
        !subject_type ||
        !component_name ||
        !sub_component_name ||
        typeof co_marks !== "object"
      ) {
        return res
          .status(400)
          .json({ error: "Missing required fields or invalid co_marks" });
      }

      for (const [co_name, marks_obtained] of Object.entries(co_marks)) {
        rowsToUpsert.push({
          session_id,
          enrollment_no,
          subject_id,
          subject_type,
          component_name,
          sub_component_name,
          co_name,
          marks_obtained,
          status: "saved",
        });
      }
    }

    for (const row of rowsToUpsert) {
      await db("marks")
        .insert(row)
        .onConflict([
          "session_id",
          "enrollment_no",
          "subject_id",
          "subject_type",
          "component_name",
          "sub_component_name",
          "co_name",
        ])
        .merge({
          marks_obtained: row.marks_obtained,
          status: row.status,
        });
    }

    res.status(200).json({ message: "Marks saved successfully" });
  } catch (error) {
    console.error("Error saving marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Submit marks of students
const submitMarks = async (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: "Invalid or empty input array" });
    }

    const rowsToInsert = [];
    const session_id = await getLatestSessionId();
    const { subject_id, subject_type, component_name, sub_component_name } =
      data[0];

    if (
      !subject_id ||
      !subject_type ||
      !component_name ||
      !sub_component_name
    ) {
      return res
        .status(400)
        .json({ error: "Missing subject/component identifiers" });
    }

    await db("marks")
      .where({
        session_id,
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
      })
      .del();

    for (const entry of data) {
      const { enrollment_no, co_marks } = entry;

      if (!enrollment_no || typeof co_marks !== "object") {
        return res
          .status(400)
          .json({ error: "Missing enrollment or co_marks" });
      }

      for (const [co_name, marks_obtained] of Object.entries(co_marks)) {
        rowsToInsert.push({
          session_id,
          enrollment_no,
          subject_id,
          subject_type,
          component_name,
          sub_component_name,
          co_name,
          marks_obtained,
          status: "submitted",
        });
      }
    }

    // Step 3: Insert all rows as final submission
    await db("marks").insert(rowsToInsert);

    res.status(200).json({ message: "Marks submitted successfully" });
  } catch (error) {
    console.error("Error submitting marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Check if marks exist
const fetchMarksData = async (req, res) => {
  const { subject_id, subject_type, component_name, sub_component_name } =
    req.query;

  if (!subject_id || !subject_type || !component_name || !sub_component_name) {
    return res.status(400).json({
      error:
        "Subject ID, Subject Type, Component Name, and Sub Component Name are required",
    });
  }

  try {
    const session_id = await getLatestSessionId();
    const faculty_id = req.userId;

    // Check faculty_subject entry
    const facultyAssignments = await db("faculty_subject")
      .where({ session_id, subject_id, subject_type, faculty_id })
      .select("section");

    if (facultyAssignments.length === 0) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Faculty not assigned to this subject" });
    }

    const assignedSections = facultyAssignments
      .map((row) => row.section)
      .filter(Boolean);

    // Fetch subject info to get branch, course, specialization, semester
    const subjectData = await db("subject")
      .where({ session_id, subject_id, subject_type })
      .select("branch_id", "course_id", "specialization", "semester")
      .first();

    if (!subjectData) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const { branch_id, course_id, specialization, semester } = subjectData;

    // Build base student query
    let studentQuery = db("student")
      .select("enrollment_no")
      .where({ session_id, branch_id, course_id, specialization, semester });

    // Filter by section if sections are assigned
    if (assignedSections.length > 0) {
      studentQuery.whereIn("section", assignedSections);
    }

    // For elective subjects, filter using elective_data
    if (subject_type.toLowerCase() === "elective") {
      studentQuery.whereIn("enrollment_no", function () {
        this.select("enrollment_no")
          .from("elective_data")
          .where({ session_id, subject_id, subject_type });
      });
    }

    const students = await studentQuery;
    const enrollmentNos = students.map((s) => s.enrollment_no);

    if (enrollmentNos.length === 0) {
      return res.status(200).json({
        status: "not_found",
        message: "No students found for this subject and faculty assignment.",
      });
    }

    // Check if marks have been submitted
    const submittedRow = await db("marks")
      .where({
        session_id,
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
        status: "submitted",
      })
      .whereIn("enrollment_no", enrollmentNos)
      .first();

    if (submittedRow) {
      return res.status(200).json({
        status: "submitted",
        message: `Marks for ${component_name} ${sub_component_name} of ${subject_id} - ${subject_type} have already been submitted.`,
      });
    }

    // Get saved marks
    const savedMarks = await db("marks")
      .select("enrollment_no", "co_name", "marks_obtained")
      .where({
        session_id,
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
        status: "saved",
      })
      .whereIn("enrollment_no", enrollmentNos);

    if (savedMarks.length > 0) {
      const testDetails = await db("test_details")
        .select("co_name", "max_marks")
        .where({
          session_id,
          subject_id,
          subject_type,
          component_name,
          sub_component_name,
        });

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

const getAssessmentComponent = async (req, res) => {
  try {
    const components = await db("marks")
      .distinct("component_name", "sub_component_name")
      .whereNotNull("component_name");

    res.json({ components });
  } catch (err) {
    console.error("Error fetching components:", err);
    res.status(500).json({ error: "Failed to fetch assessment components" });
  }
};

module.exports = {
  insertTestDetails,
  deleteTestDetails,
  fetchTestDetails,
  saveMarks,
  submitMarks,
  fetchMarksData,
  getAssessmentComponent,
};
