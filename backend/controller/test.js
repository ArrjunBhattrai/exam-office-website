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

const checkTestDetailsExists = async (req, res) => {
  const { subject_id, subject_type, component_name, sub_component_name } =
    req.body;

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
      return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });
  } catch (error) {
    console.error("Error checking test details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteTestDetails = async (req, res) => {
  const { subject_id, subject_type, component_name, sub_component_name } =
    req.body;

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

// Submit marks of students
const submitMarks = async (req, res) => {
  try {
    const {
      subject_id,
      subject_type,
      component_name,
      sub_component_name,
      marks,
    } = req.body;

    if (
      !subject_id ||
      !subject_type ||
      !component_name ||
      !sub_component_name ||
      !Array.isArray(marks)
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const marksData = marks.map(({ enrollment_no, co_name, marks }) => ({
      enrollment_no,
      subject_id,
      subject_type,
      component_name,
      sub_component_name,
      co_name,
      marks,
    }));

    await db("marks_temp").insert(marksData);

    res.status(201).json({ message: "Marks submitted successfully" });
  } catch (error) {
    console.error("Error submitting marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  insertTestDetails,
  checkTestDetailsExists,
  deleteTestDetails,
  submitMarks,
};
