const { sub } = require("framer-motion/client");
const db = require("../db/db");

const getSubmittedForms = async(req, res) => {
    const facultyId = req.user.id;
    const {subject_id, subject_type, component_name, sub_component_name } = req.query;

    try {
        const isAssigned = await db("faculty_subjects")
        .where({ faculty_id: facultyId, subject_id, subject_type })
        .first();

        if(!isAssigned) {
            return res.status(403).json({ error: "Not assigned to this subject" });
        }

        const marks = await db("marks")
        .where({
            subject_id,
            subject_type,
            component_name,
            sub_component_name,
        })
        .ansWhere("status", "submitted");

        if(marks.length === 0) {
            return res.json({ submitted: false });
        }

        return res.json({ submitted: true, data: marks });
    } catch (err) {
        console.error(err);
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
            status: "Pending"
        })
        .first();

        if(existing) {
            return res.status(400).json({ error: "Request already pending for this entry" });
        }

        const [request_id] = await db("marks_update_request").insert({
            faculty_id: facultyId,
            subject_id,
            subject_type,
            component_name,
            sub_component_name,
            reason,
        }).returning("request_id");

        await db("update_logs").insert({ request_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit request" });
    }
}

const getPastRequests = async (req, res) => {
  const { faculty_id } = req.params;

  try {
    const requests = await db('correction_requests')
      .where({ faculty_id })
      .orderBy('created_at', 'desc');

    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching past requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
    getSubmittedForms,
    submitCorrectionRequest,
    getPastRequests
};