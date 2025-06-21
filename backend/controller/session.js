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
    const {
      session_id,
      branch_id,
      course_id,
      subjects,
      electives,
      subjectCOs,
      testMarks,
      coMarks, // alias of testMarks technically
      atktMarks,
      students,
      studentElectives,
    } = req.query;

    if (!session_id || !branch_id || !course_id) {
      return res.status(400).json({ error: "All parameters are required" });
    }

    const allData = [];
    const shouldInclude = (val) => val === "true";

    // Subjects + COs
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

      const formattedSubjects = subjectData.map((s) => ({
        Type: "Subject",
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

      allData.push(...formattedSubjects);
    }

    if (shouldInclude(electives)) {
      const data = await db("elective_data").where("session_id", session_id);
      allData.push(
        ...data.map((e) => ({
          Type: "Elective",
          Enrollment: e.enrollment_no,
          SubjectID: e.subject_id,
          SubjectType: e.subject_type,
        }))
      );
    }

    if (shouldInclude(subjectCOs)) {
      const data = await db("course_outcome").where("session_id", session_id);
      allData.push(
        ...data.map((c) => ({
          Type: "Subject CO",
          SubjectID: c.subject_id,
          SubjectType: c.subject_type,
          CO: c.co_name,
          FacultyID: c.faculty_id,
        }))
      );
    }

    if (shouldInclude(testMarks)) {
      const data = await db("marks").where("session_id", session_id);
      allData.push(
        ...data.map((m) => ({
          Type: "Marks",
          Enrollment: m.enrollment_no,
          SubjectID: m.subject_id,
          SubjectType: m.subject_type,
          Component: m.component_name,
          SubComponent: m.sub_component_name,
          CO: m.co_name,
          Marks: m.marks_obtained,
          Status: m.status,
        }))
      );
    }

    if (shouldInclude(atktMarks)) {
      const data = await db("atkt_marks").where("session_id", session_id);
      allData.push(
        ...data.map((a) => ({
          Type: "ATKT Marks",
          Enrollment: a.enrollment_no,
          SubjectID: a.subject_id,
          SubjectType: a.subject_type,
          CO: a.co_name,
          Marks: a.marks_obtained,
          Status: a.status,
        }))
      );
    }

    if (shouldInclude(students)) {
      const data = await db("student")
        .where("session_id", session_id)
        .andWhere("branch_id", branch_id)
        .andWhere("course_id", course_id);
      allData.push(
        ...data.map((s) => ({
          Type: "Student",
          Enrollment: s.enrollment_no,
          Name: s.student_name,
          Section: s.section,
          Semester: s.semester,
          Status: s.status,
        }))
      );
    }

    if (shouldInclude(studentElectives)) {
      const data = await db("elective_data").where("session_id", session_id);
      allData.push(
        ...data.map((e) => ({
          Type: "Student Elective",
          Enrollment: e.enrollment_no,
          SubjectID: e.subject_id,
          SubjectType: e.subject_type,
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
