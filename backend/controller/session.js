const db = require("../db/db");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");
const os = require("os");

const createSession = async (req, res) => {
  const { start_month, start_year, end_month, end_year } = req.body;

  // Validate input
  if (!start_month || !start_year || !end_month || !end_year) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existing = await db("session")
      .where({
        start_month,
        start_year,
        end_month,
        end_year,
      })
      .first();

    if (existing) {
      return res.status(409).json({ error: "Session already exists." });
    }

    const result = await db("session").insert({
      start_month,
      start_year,
      end_month,
      end_year,
    });

    const session_id = result[0];

    const newSession = await db("session").where({ session_id }).first();

    res.status(201).json({ session: newSession });
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ error: "Server error." });
  }
};

const getLatestSession = async (req, res) => {
  try {
    const latestSession = await db("session")
      .orderBy("start_year", "desc")
      .orderBy("start_month", "desc")
      .first();

    if (!latestSession) {
      return res.status(404).json({ error: "No sessions found" });
    }

    res.json({ session: latestSession });
  } catch (err) {
    console.error("Error fetching latest session:", err);
    res.status(500).json({ error: "Failed to fetch latest session" });
  }
};

const downloadSessionData = async (req, res) => {
  try {
    const { session_id, branch_id, course_id } = req.query;

    if (!session_id || !branch_id || !course_id) {
      return res.status(400).json({ error: "All parameters are required" });
    }

    const subjects = await db("subject")
      .leftJoin("faculty_subject", function () {
        this.on("subject.subject_id", "=", "faculty_subject.subject_id")
          .andOn("subject.subject_type", "=", "faculty_subject.subject_type")
          .andOn("subject.session_id", "=", "faculty_subject.session_id");
      })
      .leftJoin("faculty", "faculty_subject.faculty_id", "faculty.faculty_id")
      .leftJoin("course_outcome", function () {
        this.on("subject.subject_id", "=", "course_outcome.subject_id")
          .andOn("subject.subject_type", "=", "course_outcome.subject_type")
          .andOn("subject.session_id", "=", "course_outcome.session_id");
      })
      .where("subject.session_id", session_id)
      .andWhere("subject.branch_id", branch_id)
      .andWhere("subject.course_id", course_id)
      .select(
        "subject.subject_id",
        "subject.subject_name",
        "subject.subject_type",
        "subject.semester",
        "subject.branch_id",
        "subject.course_id",
        "subject.specialization",
        "faculty_subject.section",
        "faculty.faculty_name",
        db.raw("GROUP_CONCAT(DISTINCT course_outcome.co_name) as cos")
      )
      .groupBy(
        "subject.subject_id",
        "subject.subject_name",
        "subject.subject_type",
        "subject.semester",
        "subject.branch_id",
        "subject.course_id",
        "subject.specialization",
        "faculty_subject.section",
        "faculty.faculty_name"
      );

    const data = subjects.map((s) => ({
      "Subject ID": s.subject_id,
      "Subject Name": s.subject_name,
      "Subject Type": s.subject_type,
      Semester: s.semester,
      "Branch ID": s.branch_id,
      "Course ID": s.course_id,
      Specialization: s.specialization,
      Section: s.section || "—",
      "Faculty Name": s.faculty_name || "Not Assigned",
      COs: s.cos || "None",
      "Is ATKT": s.subject_type.toLowerCase() === "atkt" ? "Yes" : "No",
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    const filename = `session_${session_id}_${Date.now()}.csv`;
    const filePath = path.join(os.tmpdir(), filename);
    fs.writeFileSync(filePath, csv);

    res.download(filePath, filename, (err) => {
      fs.unlinkSync(filePath); // Delete after download
    });
  } catch (err) {
    console.error("Error in downloadSessionData:", err);
    res.status(500).json({ error: "Failed to generate CSV" });
  }
};

const getAllSessions = async (req, res) => {
  try {
    const sessions = await db("session").orderBy("start_year", "desc").orderBy("start_month", "desc");
    res.status(200).json({ sessions });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
}

module.exports = {
  createSession,
  getLatestSession,
  downloadSessionData,
  getAllSessions
};
