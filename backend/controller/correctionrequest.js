const db = require("../db/db");

const getLatestSessionId = async () => {
  const latestSession = await db("session")
    .orderBy("start_year", "desc")
    .orderBy("start_month", "desc")
    .first();

  if (!latestSession) throw new Error("No academic session found");
  return latestSession.session_id;
};

const submitCorrectionRequest = async (req, res) => {
  const facultyId = req.user.userId;
  const {
    subject_id,
    subject_type,
    component_name,
    sub_component_name,
    reason,
    form_status,
    enrollment_nos,
  } = req.body;

  if (
    !subject_id ||
    !subject_type ||
    !component_name ||
    !sub_component_name ||
    !reason ||
    !form_status ||
    !Array.isArray(enrollment_nos) ||
    enrollment_nos.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Missing required fields or empty enrollment list" });
  }

  try {
    const session_id = await getLatestSessionId();

    const existing = await db("marks_update_request")
      .where({
        faculty_id: facultyId,
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
        session_id,
        status: "Pending",
      })
      .first();

    if (existing) {
      return res
        .status(400)
        .json({ error: "Request already pending for this subject-component" });
    }

    await db.transaction(async (trx) => {
      // Insert main request and get ID
      const result = await trx("marks_update_request").insert({
        faculty_id: facultyId,
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
        reason,
        form_status,
        session_id,
      });
      const request_id = result[0];
      // Map and insert all enrollments
      const studentRows = enrollment_nos.map((enrollment_no) => ({
        request_id,
        enrollment_no,
      }));

      await trx("marks_update_students").insert(studentRows);
    });

    res.status(200).json({ message: "Correction request submitted" });
  } catch (err) {
    console.error("Submit correction request failed:", err);
    res.status(500).json({ error: "Failed to submit request" });
  }
};

const getCorrectionRequests = async (req, res) => {
  const { faculty_id } = req.query;

  try {
    const session_id = await getLatestSessionId();

    let baseQuery = db("marks_update_request as mur")
      .join("marks_update_students as mus", "mur.request_id", "mus.request_id")
      .select(
        "mur.request_id",
        "mur.subject_id",
        "mur.subject_type",
        "mur.component_name",
        "mur.sub_component_name",
        "mur.reason",
        "mur.form_status",
        "mur.status",
        "mur.faculty_id",
        "mus.enrollment_no"
      )
      .where("mur.session_id", session_id)
      .orderBy("mur.created_at", "desc");

    if (faculty_id) {
      baseQuery = baseQuery.andWhere("mur.faculty_id", faculty_id);
    }

    const rawResults = await baseQuery;

    // Group rows by request_id
    const grouped = rawResults.reduce((acc, row) => {
      const {
        request_id,
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
        reason,
        form_status,
        status,
        enrollment_no,
      } = row;

      if (!acc[request_id]) {
        acc[request_id] = {
          request_id,
          subject_id,
          subject_type,
          component_name,
          sub_component_name,
          reason,
          form_status,
          status,
          enrollment_nos: [],
        };
      }

      acc[request_id].enrollment_nos.push(enrollment_no);
      return acc;
    }, {});

    const response = Object.values(grouped);
    res.status(200).json({ requests: response });
  } catch (error) {
    console.error("Error fetching correction requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const withdrawRequest = async (req, res) => {
  const { request_id } = req.params;

  try {
    const session_id = await getLatestSessionId();

    const request = await db("marks_update_request")
      .where({ request_id, session_id })
      .first();

    if (!request) {
      return res
        .status(404)
        .json({ error: "Request not found for the latest session" });
    }

    if (request.status !== "Pending") {
      return res
        .status(400)
        .json({ error: "Only pending requests can be withdrawn" });
    }

    await db.transaction(async (trx) => {
      // Delete from marks_update_students first (though CASCADE would handle it too)
      await trx("marks_update_students").where({ request_id }).del();

      // Then delete from main request table
      await trx("marks_update_request").where({ request_id, session_id }).del();
    });

    res.status(200).json({ message: "Request withdrawn" });
  } catch (err) {
    console.error("Withdraw failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkFormExists = async (req, res) => {
  const {
    subject_id,
    subject_type,
    component_name,
    sub_component_name,
    form_status,
  } = req.query;
  const facultyId = req.user.id;

  if (!subject_id || !subject_type || !form_status) {
    return res.status(400).json({ error: "Required fields missing." });
  }

  try {
    const session_id = await getLatestSessionId();

    if (form_status === "ATKT") {
      const rows = await db("atkt_marks").where({
        subject_id,
        subject_type,
        session_id,
      });

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No marks found for this subject." });
      }

      const statuses = new Set(rows.map((row) => row.status));

      if (statuses.has("saved")) {
        return res
          .status(400)
          .json({ error: "Marks have not been submitted for this." });
      }

      if (statuses.has("resaved")) {
        return res
          .status(400)
          .json({ error: "A request already exists and is in progress." });
      }

      // submitted or mixed submitted/rejected
      return res
        .status(200)
        .json({ message: "Form exists and can be used to raise a request." });
    } else if (form_status === "Regular") {
      if (!component_name || !sub_component_name) {
        return res.status(400).json({
          error: "Component and Sub-component are required for Regular form.",
        });
      }

      const rows = await db("marks").where({
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
        session_id,
      });

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No marks found for this subject." });
      }

      const statuses = new Set(rows.map((row) => row.status));

      if (statuses.has("saved")) {
        return res
          .status(400)
          .json({ error: "Marks have not been submitted for this." });
      }

      if (statuses.has("resaved")) {
        return res
          .status(400)
          .json({ error: "A request already exists and is in progress." });
      }

      return res
        .status(200)
        .json({ message: "Form exists and can be used to raise a request." });
    }

    return res.status(400).json({ error: "Invalid form_status provided." });
  } catch (err) {
    console.error("Form check failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateRequestStatus = async (req, res) => {
  const { request_id } = req.params;
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const request = await db("marks_update_request")
      .where({ request_id })
      .first();

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        message: "Action has already been taken for this request.",
      });
    }

    await db("marks_update_request").where({ request_id }).update({ status });

    res.status(200).json({ message: "Request status updated successfully" });
  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchMarksData = async (req, res) => {
  const { request_id } = req.params;

  try {
    const session_id = await getLatestSessionId();

    // Get the request details
    const request = await db("marks_update_request")
      .where({ request_id, session_id })
      .first();

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "Approved") {
      return res.status(400).json({ error: "Request not approved yet" });
    }

    const {
      subject_id,
      subject_type,
      component_name,
      sub_component_name,
      form_status,
    } = request;

    // Get enrollment numbers related to this request
    const studentEntries = await db("marks_update_students")
      .where({ request_id })
      .select("enrollment_no");

    const enrollmentNos = studentEntries.map((s) => s.enrollment_no);

    if (enrollmentNos.length === 0) {
      return res.status(404).json({ error: "No students found in request" });
    }

    const table = form_status === "ATKT" ? "atkt_marks" : "marks";

    let marksQuery = db(table)
      .whereIn("enrollment_no", enrollmentNos)
      .andWhere({ subject_id, subject_type, session_id });

    if (form_status === "Regular") {
      marksQuery = marksQuery.andWhere({
        component_name,
        sub_component_name,
      });
    }

    const marks = await marksQuery.select(
      "enrollment_no",
      "co_name",
      "marks_obtained"
    );

    // Fetch test details
    const testDetailsTable =
      form_status === "ATKT" ? "atkt_test_details" : "test_details";

    const test_details = await db(testDetailsTable)
      .where({ subject_id, subject_type, session_id })
      .select("co_name", "max_marks");

    res.status(200).json({
      message: "Marks data and test details fetched successfully",
      marks,
      test_details,
    });
  } catch (err) {
    console.error("Proceed failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resubmitForm = async (req, res) => {
  const {
    subject_id,
    subject_type,
    component_name,
    sub_component_name,
    form_status,
    updatedMarks, // [{ enrollment_no, co_name, marks_obtained }]
    request_id,
  } = req.body;

  if (
    !subject_id ||
    !subject_type ||
    !form_status ||
    !Array.isArray(updatedMarks) ||
    !request_id
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const table = form_status === "ATKT" ? "atkt_marks" : "marks";

  const trx = await db.transaction();
  try {
    const session_id = await getLatestSessionId();

    for (const entry of updatedMarks) {
      const base = {
        session_id,
        enrollment_no: entry.enrollment_no,
        subject_id,
        subject_type,
        co_name: entry.co_name,
        marks_obtained: entry.marks_obtained,
        status: "resubmitted",
      };

      if (form_status !== "ATKT") {
        base.component_name = component_name;
        base.sub_component_name = sub_component_name;
      }

      const conflictCols = [
        "session_id",
        "enrollment_no",
        "subject_id",
        "subject_type",
        "co_name",
      ];
      if (form_status !== "ATKT") {
        conflictCols.push("component_name", "sub_component_name");
      }

      await trx(table).insert(base).onConflict(conflictCols).merge({
        marks_obtained: entry.marks_obtained,
        status: "resubmitted",
      });
    }

    await trx("update_logs").insert({ request_id });

    await trx.commit();
    res.status(200).json({ message: "Form resubmitted and log updated" });
  } catch (err) {
    await trx.rollback();
    console.error("Form resubmission failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  submitCorrectionRequest,
  getCorrectionRequests,
  updateRequestStatus,
  withdrawRequest,
  checkFormExists,
  fetchMarksData,
  resubmitForm,
};
