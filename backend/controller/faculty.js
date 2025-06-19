const db = require("../db/db");

// GET all pending faculty registration requests for branch
const getPendingFacultyRequests = async (req, res) => {
  try {
    const branch_id = req.user.branchId;

    if (!branch_id) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not an HOD" });
    }

    const pendingRequests = await db("faculty_registration_request")
      .where("branch_id", branch_id)
      .select("faculty_id", "faculty_name", "faculty_email");

    return res.status(200).json(pendingRequests);
  } catch (error) {
    console.error("Error fetching faculty registration requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Approving request of faculty registration
const approveFacultyRequest = async (req, res) => {
  try {
    const branch_id = req.user.branchId;
    const { faculty_id } = req.body;

    if (!branch_id) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not an HOD" });
    }

    const request = await db("faculty_registration_request")
      .where({ faculty_id, branch_id: branch_id })
      .first();

    if (!request) {
      return res.status(404).json({ message: "Faculty request not found" });
    }

    await db("faculty").insert({
      faculty_id: request.faculty_id,
      faculty_name: request.faculty_name,
      faculty_email: request.faculty_email,
      password: request.password,
      branch_id: request.branch_id,
    });

    await db("faculty_registration_request").where({ faculty_id }).del();

    return res.status(200).json({ message: "Faculty approved successfully" });
  } catch (error) {
    console.error("Error approving faculty request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Rejecting a registration request
const rejectFacultyRequest = async (req, res) => {
  try {
    const branch_id = req.user.branchId;
    const { faculty_id } = req.body;

    if (!branch_id) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not an HOD" });
    }

    const deleted = await db("faculty_registration_request")
      .where({ faculty_id, branch_id: branch_id })
      .del();

    if (deleted === 0) {
      return res.status(404).json({ message: "Faculty request not found" });
    }

    return res
      .status(200)
      .json({ message: "Faculty request rejected and removed" });
  } catch (error) {
    console.error("Error rejecting faculty request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get faculties of a particular branch
const getFaculties = async (req, res) => {
  const { branch_id } = req.query;

  if (!branch_id) {
    return res.status(400).json({ error: "branch_id is required" });
  }

  try {
    const faculties = await db("faculty")
      .where({ branch_id })
      .select("faculty_id", "faculty_name", "faculty_email");

    return res.status(200).json(faculties);
  } catch (error) {
    console.error("Error fetching faculties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Assign faculty for a subject
const assignFaculties = async (req, res) => {
  try {
    const branch_id = req.user.branchId;
    const { faculty_ids, subject_id, subject_type, section } = req.body;

    if (!branch_id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (
      !Array.isArray(faculty_ids) ||
      faculty_ids.length === 0 ||
      faculty_ids.length > 2
    ) {
      return res
        .status(400)
        .json({ message: "Please provide 1 or 2 faculty IDs" });
    }

    // Validate subject existence
    const subject = await db("subject")
      .where({ subject_id, subject_type, branch_id })
      .first();

    if (!subject) {
      return res
        .status(404)
        .json({ message: "Subject not found in your branch" });
    }

    const { course_id, specialization } = subject;

    // Validate section if provided
    if (section) {
      const sectionExists = await db("section")
        .where({ branch_id, course_id, specialization, section })
        .first();

      if (!sectionExists) {
        return res.status(400).json({
          message: `Section '${section}' does not exist for the given course.`,
        });
      }
    } else {
      // If no section provided but section-wise bifurcation exists
      const existingSections = await db("section")
        .where({ branch_id, course_id, specialization });

      if (existingSections.length > 0) {
        return res.status(400).json({
          message:
            "Section is required because the course has section-wise assignments.",
        });
      }
    }

    // Get latest session
    const latestSession = await db("session")
      .orderBy("start_year", "desc")
      .orderBy("start_month", "desc")
      .first();

    if (!latestSession) {
      return res.status(500).json({ message: "No active session found" });
    }

    const session_id = latestSession.session_id;

    // Transaction: remove old + insert new assignments
    await db.transaction(async (trx) => {
      await trx("faculty_subject")
        .where({ subject_id, subject_type, session_id, section: section || null })
        .del();

      const assignments = faculty_ids.map((faculty_id, index) => ({
        faculty_id,
        subject_id,
        subject_type,
        session_id,
        assignment_type: index === 0 ? "primary" : "secondary",
        section: section || null,
      }));

      await trx("faculty_subject").insert(assignments);
    });

    return res.status(200).json({ message: "Faculty assigned successfully" });
  } catch (err) {
    console.error("Error assigning faculties:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getPendingFacultyRequests,
  approveFacultyRequest,
  rejectFacultyRequest,
  getFaculties,
  assignFaculties,
};