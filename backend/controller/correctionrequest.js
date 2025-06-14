const db = require("../db/db");

const getSubmittedForms = async (req, res) => {
  const facultyId = req.user.userId;
  console.log("req.user:", req.user);
  console.log(facultyId);

  const { subject_id, subject_type, component_name, sub_component_name } =
    req.query;

  try {
    const isAssigned = await db("faculty_subject")
      .where({ faculty_id: facultyId, subject_id, subject_type })
      .first();

    if (!isAssigned) {
      return res.status(403).json({ error: "Not assigned to this subject" });
    }

    const marks = await db("marks")
      .where({
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
      })
      .andWhere("status", "submitted");

    if (marks.length === 0) {
      return res.json({ submitted: false });
    }

    return res.json({ submitted: true, data: marks });
  } catch (err) {
    console.error("Error in getSubmittedForms:", err.stack || err);
    res.status(500).json({ error: "Failed to fetch submitted forms" });
  }
};

const submitCorrectionRequest = async (req, res) => {
  const facultyId = req.user.id;
  const {
    subject_id,
    subject_type,
    component_name,
    sub_component_name,
    reason,
  } = req.body;

  try {
    const existing = await db("marks_update_request")
      .where({
        faculty_id: facultyId,
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
        status: "Pending",
      })
      .first();

    if (existing) {
      return res
        .status(400)
        .json({ error: "Request already pending for this entry" });
    }

    const [request_id] = await db("marks_update_request")
      .insert({
        faculty_id: facultyId,
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
        reason,
      })
      .returning("request_id");

    await db("update_logs").insert({ request_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit request" });
  }
};

const getPastRequests = async (req, res) => {
  const { faculty_id } = req.params;

  try {
    const requests = await db("marks_update_request")
      .where({ faculty_id })
      .orderBy("created_at", "desc");

    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching past requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCorrectionRequests = async (req, res) => {
  try {
    const requests = await db("marks_update_request as m")
      .join("faculty as f", "m.faculty_id", "f.faculty_id")
      .join("subject as s", function () {
        this.on("m.subject_id", "=", "s.subject_id").andOn(
          "m.subject_type",
          "=",
          "s.subject_type"
        );
      })
      .select(
        "m.request_id",
        "m.faculty_id",
        "f.faculty_name",
        "s.subject_name",
        "m.subject_id",
        "m.subject_type",
        "m.component_name",
        "m.sub_component_name",
        "m.reason",
        "m.status"
      )
      .orderBy("m.request_id", "desc");
    res.status(200).json({ requests });
  } catch (err) {
    console.error("Error fetching correction requests for admin:", err);
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
    await db("marks_update_request").where({ request_id }).update({ status });

    await db("update_logs").insert({ request_id });

    res.status(200).json({ message: "Request status updated successfully" });
  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getSubmittedForms,
  submitCorrectionRequest,
  getPastRequests,
  getAllCorrectionRequests,
  updateRequestStatus
};
