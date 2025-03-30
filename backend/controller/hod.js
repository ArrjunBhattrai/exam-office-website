const db = require("../db/db");
const jwt = require("jsonwebtoken");

//Get Branch Details
const getBranchDetails = async (req, res) => {
 //console.log(req.user);
  try {
    const faculty_id  = req.user.userId; // Extracted from authenticated user token
    //console.log(faculty_id);
    const branch = await db('hod')
      .select('branch_id')
      .where('hod_id', faculty_id)
      .first();

    if (!branch) {
      return res.status(403).json({ message: "Unauthorized: You are not an HOD" });
    }
    //console.log(branch);
    const faculties = await db('faculty')
      .where('branch_id', branch.branch_id)
      .select('faculty_id', 'faculty_name', 'faculty_email');

    const students = await db('student')
      .where('branch_id', branch.branch_id)
      .select('enrollment_no', 'student_name');

    return res.json({
      branch_id: branch.branch_id,
      faculties,
      students
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get Faculties of the branch
const getFaculties = async (req, res) => {
  try {
    const  faculty_id  = req.user.userId;

    const branch = await db('hod')
      .select('branch_id')
      .where('hod_id', faculty_id)
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

//Get Subjects of the branch
const getSubjects = async (req, res) => {
  try {
    const  faculty_id  = req.user.userId;

    const branch = await db('hod')
      .select('branch_id')
      .where('hod_id', faculty_id)
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

//Assign faculty to a subject
const assignFaculty = async (req, res) => {
  try {
    const { faculty_id, subject_id, subject_type } = req.body;
    const   hod_id  = req.user.userId;

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

//Update assigned Faculty
const updateAssignedFaculty = async (req, res) => {
  try {
    const { old_faculty_id, new_faculty_id, subject_id, subject_type } = req.body;
    const { faculty_id: hod_id } = req.user;

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

//Remove assigned faculty
const removeAssignedFaculty = async (req, res) => {
  try {
    const { faculty_id, subject_id, subject_type } = req.body;
    const { faculty_id: hod_id } = req.user;

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
  assignFaculty,
  updateAssignedFaculty,
  removeAssignedFaculty,
};
