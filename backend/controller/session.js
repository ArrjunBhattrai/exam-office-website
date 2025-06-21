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

const getAllSessions = async (req, res) => {
  try {
    const sessions = await db("session").orderBy("start_year", "desc").orderBy("start_month", "desc");
    res.status(200).json({ sessions });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
}

const downloadSessionData = async (req, res) => {
  try {
    const {
      session_id,
      branch_id,
      course_id,
      specialization,
      students,
      subjects,
      atkt,
      electives,
      marks,
      atktMarks
    } = req.query;

    if (!session_id || !branch_id || !course_id || !specialization) {
      return res.status(400).json({ error: "All parameters are required" });
    }

    const allData = [];
    const shouldInclude = (val) => val === "true";

    // Check if sections exist
    const sectionsExist = await db("section")
      .where({ branch_id, course_id, specialization })
      .first();

    // Students
    if (shouldInclude(students)) {
      const studentData = await db("student")
        .where({ session_id, branch_id, course_id, specialization });

      allData.push(
        ...studentData.map((s) => ({
          Type: "Student",
          Enrollment: s.enrollment_no,
          Name: s.student_name,
          Semester: s.semester,
          Status: s.status,
          Section: sectionsExist ? s.section : "—"
        }))
      );
    }

    // Subjects
    if (shouldInclude(subjects)) {
      const subjectData = await db("subject")
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
        .andWhere("subject.specialization", specialization)
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

      allData.push(
        ...subjectData.map((s) => ({
          Type: "Subject",
          "Subject ID": s.subject_id,
          "Subject Name": s.subject_name,
          "Subject Type": s.subject_type,
          Semester: s.semester,
          Section: sectionsExist ? s.section || "—" : "—",
          "Faculty Name": s.faculty_name || "Not Assigned",
          COs: s.cos || "Not Assigned",
          "Is ATKT": s.subject_type.toLowerCase() === "atkt" ? "Yes" : "No"
        }))
      );
    }

    // ATKT Data
    if (shouldInclude(atkt)) {
      const data = await db("atkt_students")
        .join("student", "student.enrollment_no", "=", "atkt_students.enrollment_no")
        .where("student.session_id", session_id)
        .andWhere("student.branch_id", branch_id)
        .andWhere("student.course_id", course_id)
        .andWhere("student.specialization", specialization);

      allData.push(
        ...data.map((a) => ({
          Type: "ATKT",
          Enrollment: a.enrollment_no,
          Name: a.student_name,
          SubjectID: a.subject_id,
          SubjectType: a.subject_type,
          SubjectSession: a.subject_session
        }))
      );
    }

    // Elective Data
    if (shouldInclude(electives)) {
      const data = await db("elective_data")
        .where({ session_id, branch_id, course_id, specialization });
      allData.push(
        ...data.map((e) => ({
          Type: "Elective",
          SubjectID: e.subject_id,
          SubjectType: e.subject_type,
          Enrollment: e.enrollment_no
        }))
      );
    }

    // Marks Data
    if (shouldInclude(marks)) {
      const data = await db("marks")
        .join("subject", function () {
          this.on("marks.subject_id", "=", "subject.subject_id")
            .andOn("marks.subject_type", "=", "subject.subject_type")
            .andOn("marks.session_id", "=", "subject.session_id");
        })
        .where("marks.session_id", session_id)
        .andWhere("subject.branch_id", branch_id)
        .andWhere("subject.course_id", course_id)
        .andWhere("subject.specialization", specialization);

      allData.push(
        ...data.map((m) => ({
          Type: "Marks",
          Enrollment: m.enrollment_no,
          SubjectID: m.subject_id,
          SubjectType: m.subject_type,
          Component: m.component_name,
          SubComponent: m.sub_component_name,
          CO: m.co_name,
          Marks: m.marks_obtained || "",
          Status: m.status
        }))
      );
    }

    // ATKT Marks Data
    if (shouldInclude(atktMarks)) {
      const data = await db("atkt_marks")
        .join("subject", function () {
          this.on("atkt_marks.subject_id", "=", "subject.subject_id")
            .andOn("atkt_marks.subject_type", "=", "subject.subject_type")
            .andOn("atkt_marks.session_id", "=", "subject.session_id");
        })
        .where("atkt_marks.session_id", session_id)
        .andWhere("subject.branch_id", branch_id)
        .andWhere("subject.course_id", course_id)
        .andWhere("subject.specialization", specialization);

      allData.push(
        ...data.map((a) => ({
          Type: "ATKT Marks",
          Enrollment: a.enrollment_no,
          SubjectID: a.subject_id,
          SubjectType: a.subject_type,
          CO: a.co_name,
          Marks: a.marks_obtained || "",
          Status: a.status
        }))
      );
    }

    if (allData.length === 0) {
      return res.status(400).json({ error: "No data selected for download" });
    }

    const parser = new Parser();
    const csv = parser.parse(allData);

    const filename = `session_${session_id}_${Date.now()}.csv`;
    const filePath = path.join(os.tmpdir(), filename);
    fs.writeFileSync(filePath, csv);

    res.download(filePath, filename, () => fs.unlinkSync(filePath));
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Failed to generate session data" });
  }
};

module.exports = {
  createSession,
  getLatestSession,
  downloadSessionData,
  getAllSessions
};
