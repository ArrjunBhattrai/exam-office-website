const db = require("../db/db");

// const getSubmittedForms = async (req, res) => {
//   const facultyId = req.user.userId;
//   console.log("req.user:", req.user);
//   console.log(facultyId);

//   const { subject_id, subject_type, component_name, sub_component_name } =
//     req.query;

//   try {
//     const isAssigned = await db("faculty_subject")
//       .where({ faculty_id: facultyId, subject_id, subject_type })
//       .first();

//     if (!isAssigned) {
//       return res.status(403).json({ error: "Not assigned to this subject" });
//     }

//     const marks = await db("marks")
//       .where({
//         subject_id,
//         subject_type,
//         component_name,
//         sub_component_name,
//       })
//       .andWhere("status", "submitted");

//     if (marks.length === 0) {
//       return res.json({ submitted: false });
//     }

//     return res.json({ submitted: true, data: marks });
//   } catch (err) {
//     console.error("Error in getSubmittedForms:", err.stack || err);
//     res.status(500).json({ error: "Failed to fetch submitted forms" });
//   }
// }; // of no use

const submitCorrectionRequest = async (req, res) => {
  const facultyId = req.user.id;
  const {
    subject_id,
    subject_type,
    component_name,
    sub_component_name,
    reason,
    form_status,
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

    await db("marks_update_request")
      .insert({
        faculty_id: facultyId,
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
        reason,
        form_status // ATKT or Regular
      });

      res.status(200).json({ message: "Correction request submitted" });
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

const checkFormExists = async (req, res) => {
  const { subject_id, subject_type, form_status } = req.query;
  const facultyId = req.user.id;

  try {
    const table = form_status === "ATKT" ? "atkt_marks" : "marks";

    const form = await db(table)
      .where({ subject_id, subject_type })
      .andWhere("status", "submitted")
      .first();

      if (!form) {
      return res.status(404).json({ error: "No submitted form found for this subject." });
    }

    res.status(200).json({ message: "Form exists and can be used to raise a request." });
  } catch(err) {
    console.error("Form check failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const withdrawRequest = async (req, res) => {
  const { request_id } = req.params;

  try {
    const request = await db("marks_update_request")
      .where({ request_id })
      .first();

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({ error: "Only pending requests can be withdrawn" });
    }

    await db("marks_update_request")
      .where({ request_id })
      .del();

    res.status(200).json({ message: "Request withdrawn" });
  } catch(err) {
    console.error("Withdraw failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const proceedWithApprovedRequest = async (req, res) => {
  const { request_id } = req.params;

  try {
    const request = await db("marks_update_request").where({ request_id }).first();
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (request.status !== "Approved") {
      return res.status(400).json({ error: "Request not approved yet" });
    }

    const { subject_id, subject_type, component_name, sub_component_name, form_status } = request;

    const table = form_status === "ATKT" ? "atkt_marks" : "marks";

    await db(table)
      .where({
        subject_id,
        subject_type,
        component_name,
        sub_component_name,
      })
      .update({ status: "saved" });

      res.status(200).json({ message: "Form reopened for editing" });
  } catch (err){
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

  const table = form_status === "ATKT" ? "atkt_marks" : "marks";

  const trx = await db.transaction();
  try {
    for (const entry of updatedMarks) {
      await trx(table)
        .where({
          enrollment_no: entry.enrollment_no,
          subject_id,
          subject_type,
          component_name,
          sub_component_name,
        })
        .update({
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
}

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
        "m.status",
        "m.form_status"
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

// const proceedCorrectionRequest = async (req, res) => {
//   const { request_id } = req.params;

//   try {
//     const request = await db("marks_update_request").where({ request_id }).first();

//     if (!request) {
//       return res.status(404).json({ error: "Request not found" });
//     }

//     const {
//       subject_id,
//       subject_type,
//       component_name,
//       sub_component_name,
//       faculty_id,
//       form_status,
//     } = request;

//     // Determine the correct table to update
//     const tableName = form_status === "ATKT" ? "atkt_marks" : "marks";

//     let query = db(tableName)
//       .where({ subject_id, subject_type });

//     if (form_status === "Regular") {
//       query = query
//         .andWhere({ component_name, sub_component_name });
//     }

//     await query.update({ status: "saved" });

//     return res.status(200).json({ message: "Form reset to saved status" });
//   } catch (err) {
//     console.error("Error processing proceed action:", err);
//     res.status(500).json({ error: "Failed to proceed with correction" });
//   }
// };


module.exports = {
  // getSubmittedForms,
  submitCorrectionRequest,
  getPastRequests,
  getAllCorrectionRequests,
  updateRequestStatus,
  // proceedCorrectionRequest,
  withdrawRequest,
  checkFormExists,
  resubmitForm,
  proceedWithApprovedRequest
};
