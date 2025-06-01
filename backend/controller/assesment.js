const db = require("../db/db");

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

  const insertData = co_marks.map(({ co_name, max_marks }) => ({
    subject_id,
    subject_type,
    component_name,
    sub_component_name,
    co_name,
    max_marks,
  }));

  try {
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
    const existingRecords = await db("test_details").where({
      subject_id,
      subject_type,
      component_name,
      sub_component_name,
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
  const { subject_id, subject_type, component_name, sub_component_name } =
    req.query;

  if (!subject_id || !subject_type || !component_name || !sub_component_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const deletedRows = await db("test_details")
      .where({
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
    // Check if any row is submitted
    const submittedRow = await db("marks")
      .where({ subject_id, subject_type, component_name, sub_component_name })
      .andWhere("status", "submitted")
      .first();

    if (submittedRow) {
      return res.status(200).json({
        status: "submitted",
        message: `Marks for ${component_name} ${sub_component_name} of ${subject_id} - ${subject_type} have already been submitted.`,
      });
    }

    // Check for saved rows
    const savedMarks = await db("marks")
      .select("marks.enrollment_no", "marks.co_name", "marks.marks_obtained")
      .where({
        "marks.subject_id": subject_id,
        "marks.subject_type": subject_type,
        "marks.component_name": component_name,
        "marks.sub_component_name": sub_component_name,
        "marks.status": "saved",
      });

    if (savedMarks.length > 0) {
      // Fetch test_details
      const testDetails = await db("test_details")
        .select("co_name", "max_marks")
        .where({
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

module.exports = {
  insertTestDetails,
  deleteTestDetails,
  fetchTestDetails,
  saveMarks,
  submitMarks,
  fetchMarksData,
};
