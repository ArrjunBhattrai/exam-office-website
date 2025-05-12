const db = require("../db/db");

// GET all pending faculty registration requests for HOD's branch
const getPendingFacultyRequests = async (req, res) => {
  try {
    const hod_id = req.user.userId;

    const branch = await db("hod")
      .select("branch_id")
      .where("hod_id", hod_id)
      .first();

    if (!branch) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not an HOD" });
    }

    const pendingRequests = await db("faculty_registration_request")
      .where("branch_id", branch.branch_id)
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
    const hod_id = req.user.userId;
    const { faculty_id } = req.body;

    const branch = await db("hod")
      .select("branch_id")
      .where("hod_id", hod_id)
      .first();

    if (!branch) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not an HOD" });
    }

    const request = await db("faculty_registration_request")
      .where({ faculty_id, branch_id: branch.branch_id })
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
    const hod_id = req.user.userId;
    const { faculty_id } = req.body;

    const branch = await db("hod")
      .select("branch_id")
      .where("hod_id", hod_id)
      .first();

    if (!branch) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not an HOD" });
    }

    const deleted = await db("faculty_registration_request")
      .where({ faculty_id, branch_id: branch.branch_id })
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

//Get distinct Semsesters
const getDistinctSemester = async (req, res) => {
  try {
    const semesters = await db("subject")
      .distinct("semester")
      .orderBy("semester");

    res.status(200).json({
      semesters: semesters.map((row) => row.semester),
    });
  } catch (error) {
    console.error("Error fetching semesters:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Get Department details(semester wise)
const getDepartmentDetails = async (req, res) => {
  const { semester } = req.params;

  try {
    const subjects = await db("subject")
      .where("semester", semester)
      .select("subject_id", "subject_type", "subject_name");

    const details = await Promise.all(
      subjects.map(async (subject) => {
        const { subject_id, subject_type, subject_name } = subject;

        const faculty = await db("faculty_subject")
          .join("faculty", "faculty_subject.faculty_id", "faculty.faculty_id")
          .where({
            "faculty_subject.subject_id": subject_id,
            "faculty_subject.subject_type": subject_type,
          })
          .select("faculty.faculty_id", "faculty.faculty_name")
          .first();

          const students = await db("student_subject")
          .join("student", "student_subject.enrollment_no", "student.enrollment_no")
          .where({
            "student_subject.subject_id": subject_id,
            "student_subject.subject_type": subject_type,
          })
          .select("student.enrollment_no", "student.student_name");

        return {
          subject_id,
          subject_type,
          subject_name,
          faculty_assigned: faculty || null,
          students_enrolled: students.map((s) => s.enrollment_no),
        };
      })
    );

    res.status(200).json({ details: details });
  } catch (error) {
    console.error("Error fetching detailed subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Get subject details (semester wise)
const getSubjectDetailsBySemester = async (req, res) => {
  const { semester } = req.params;

  try {
    const subjects = await db("subject as s")
      .leftJoin("faculty_subject as fs", function () {
        this.on("s.subject_id", "=", "fs.subject_id").andOn(
          "s.subject_type",
          "=",
          "fs.subject_type"
        );
      })
      .leftJoin("faculty as f", "fs.faculty_id", "f.faculty_id")
      .where("s.semester", semester)
      .select(
        "s.subject_id",
        "s.subject_name",
        "s.subject_type",
        "s.semester",
        "f.faculty_id",
        "f.faculty_name"
      );

    res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects by semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get Faculties of the branch
const getFaculties = async (req, res) => {
  try {
    const hod_id = req.user.userId;

    const branch = await db("hod")
      .select("branch_id")
      .where("hod_id", hod_id)
      .first();

    if (!branch) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not an HOD" });
    }

    const faculties = await db("faculty")
      .where("branch_id", branch.branch_id)
      .select("faculty_id", "faculty_name", "faculty_email");

    return res.json(faculties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Assign or Update Faculty to a Subject
const assignOrUpdateFaculty = async (req, res) => {
  try {
    const { faculty_id, subject_id, subject_type } = req.body;
    const hod_id = req.user.userId;

    const branch = await db("hod")
      .select("branch_id")
      .where("hod_id", hod_id)
      .first();

    if (!branch) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not an HOD" });
    }

    const subject = await db("subject")
      .where({ subject_id, subject_type, branch_id: branch.branch_id })
      .first();

    if (!subject) {
      return res
        .status(404)
        .json({ message: "Subject not found in HOD's department" });
    }

    const faculty = await db("faculty")
      .where({ faculty_id, branch_id: branch.branch_id })
      .first();

    if (!faculty) {
      return res
        .status(404)
        .json({ message: "Faculty not found in department" });
    }

    const existingAssignment = await db("faculty_subject")
      .where({ subject_id, subject_type })
      .first();

    if (existingAssignment) {
      await db("faculty_subject")
        .where({ subject_id, subject_type })
        .del();
    }

    await db("faculty_subject").insert({
      faculty_id,
      subject_id,
      subject_type,
    });

    return res.json({
      message: existingAssignment
        ? "Faculty updated successfully"
        : "Faculty assigned successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getPendingFacultyRequests,
  approveFacultyRequest,
  rejectFacultyRequest,
  getDistinctSemester,
  getSubjectDetailsBySemester,
  getDepartmentDetails,
  getFaculties,
  assignOrUpdateFaculty
};
