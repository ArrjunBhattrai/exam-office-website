const db = require("../db/db");

// Get Branch Details
const getBranchDetails = async (req, res) => {
  try {
    const hod_id = req.user.userId; 
    const branch = await db('hod')
      .select('branch_id')
      .where('hod_id', hod_id)
      .first();

    if (!branch) {
      return res.status(403).json({ message: "This Hod Id doesn't exist for any branch" });
    }

    const faculties = await db('faculty')
      .where('branch_id', branch.branch_id)
      .select('faculty_id', 'faculty_name', 'faculty_email');

    const students = await db('student')
      .where('branch_id', branch.branch_id)
      .select('enrollment_no', 'student_name');

    return res.json({
      branch_id: branch.branch_id,
      faculties,
      students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Faculties of the branch
const getFaculties = async (req, res) => {
  try {
    const hod_id = req.user.userId;

    const branch = await db('hod')
      .select('branch_id')
      .where('hod_id', hod_id)
      .first();

    if (!branch) {
      return res.status(403).json({ message: "Unauthorized: You are not an HOD" });
    }

    const faculties = await db('faculty')
      .where('branch_id', branch.branch_id)
      .select('faculty_id', 'faculty_name', 'faculty_email');

    return res.json(faculties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Subjects of the branch
const getSubjects = async (req, res) => {
  try {
    const hod_id = req.user.userId;

    const branch = await db('hod')
      .select('branch_id')
      .where('hod_id', hod_id)
      .first();

    if (!branch) {
      return res.status(403).json({ message: "Unauthorized: You are not an HOD" });
    }

    const subjects = await db('subject')
      .where('branch_id', branch.branch_id)
      .select('subject_id', 'subject_name', 'semester', 'subject_type');

    return res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

    return res.status(200).json({ requests: pendingRequests });
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
      return res.status(403).json({ message: "Unauthorized: You are not an HOD" });
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

    await db("faculty_registration_request")
      .where({ faculty_id })
      .del();

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
      return res.status(403).json({ message: "Unauthorized: You are not an HOD" });
    }

    const deleted = await db("faculty_registration_request")
      .where({ faculty_id, branch_id: branch.branch_id })
      .del();

    if (deleted === 0) {
      return res.status(404).json({ message: "Faculty request not found" });
    }

    return res.status(200).json({ message: "Faculty request rejected and removed" });
  } catch (error) {
    console.error("Error rejecting faculty request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Assign faculty to a subject
const assignFaculty = async (req, res) => {
  try {
    const { faculty_id, subject_id, subject_type } = req.body;
    const hod_id = req.user.userId;

    const branch = await db('hod')
      .select('branch_id')
      .where('hod_id', hod_id)
      .first();

    if (!branch) {
      return res.status(403).json({ message: "Unauthorized: You are not an HOD" });
    }

    const subject = await db('subject')
      .where({ subject_id, subject_type, branch_id: branch.branch_id })
      .first();

    if (!subject) {
      return res.status(404).json({ message: "Subject not found in HOD's department" });
    }

    const faculty = await db('faculty')
      .where({ faculty_id, branch_id: branch.branch_id })
      .first();

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found in department" });
    }

    await db('faculty_subject').insert({ faculty_id, subject_id, subject_type });

    return res.json({ message: "Faculty assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update assigned faculty
const updateAssignedFaculty = async (req, res) => {
  try {
    const { old_faculty_id, new_faculty_id, subject_id, subject_type } = req.body;
    const hod_id = req.user.userId;

    const branch = await db('hod')
      .select('branch_id')
      .where('hod_id', hod_id)
      .first();

    if (!branch) {
      return res.status(403).json({ message: "Unauthorized: You are not an HOD" });
    }

    const faculty = await db('faculty')
      .where({ faculty_id: new_faculty_id, branch_id: branch.branch_id })
      .first();

    if (!faculty) {
      return res.status(404).json({ message: "New faculty not found in department" });
    }

    const existingAssignment = await db('faculty_subject')
      .where({ faculty_id: old_faculty_id, subject_id, subject_type })
      .first();

    if (!existingAssignment) {
      return res.status(404).json({ message: "Old faculty is not assigned to this subject" });
    }

    await db('faculty_subject')
      .where({ faculty_id: old_faculty_id, subject_id, subject_type })
      .update({ faculty_id: new_faculty_id });

    return res.json({ message: "Faculty updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove assigned faculty
const removeAssignedFaculty = async (req, res) => {
  try {
    const { faculty_id, subject_id, subject_type } = req.body;
    const hod_id = req.user.userId;

    const branch = await db('hod')
      .select('branch_id')
      .where('hod_id', hod_id)
      .first();

    if (!branch) {
      return res.status(403).json({ message: "Unauthorized: You are not an HOD" });
    }

    const existingAssignment = await db('faculty_subject')
      .where({ faculty_id, subject_id, subject_type })
      .first();

    if (!existingAssignment) {
      return res.status(404).json({ message: "Faculty is not assigned to this subject" });
    }

    await db('faculty_subject')
      .where({ faculty_id, subject_id, subject_type })
      .del();

    return res.json({ message: "Faculty removed from subject" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getBranchDetails,
  getFaculties,
  getSubjects,
  getPendingFacultyRequests,
  approveFacultyRequest,
  rejectFacultyRequest,
  assignFaculty,
  updateAssignedFaculty,
  removeAssignedFaculty,
};
