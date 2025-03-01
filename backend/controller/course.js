const db = require("../db/db");

// Create Course
const createCourse = async (req, res) => {
  try {
    const { course_name, year_of_pursuing, college_id } = req.body;
    const { user_type } = req.user;
    console.log(course_name, year_of_pursuing, college_id);
    if (user_type !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    if (!course_name || !year_of_pursuing || !college_id) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("================ 1");

    const [course] = await db("course")
      .insert({
        course_name,
        year_of_pursuing,
        college_id,
      })
      .returning("*");
    console.log("================ 1");
    res.status(201).json({ data: { course } });
  } catch (error) {
    res.status(500).json({ message: "Error registering course", error });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Please provide course ID" });
    }

    const course = await db("course").where("course_id", id).first();

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await db("course").select("*");

    if (!courses.length) {
      return res.status(404).json({ message: "No courses found" });
    }

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { course_name, year_of_pursuing, college_id } = req.body;
    const { user_type } = req.user;
    console.log(course_name, year_of_pursuing, college_id);
    if (user_type !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    if (!course_name || !year_of_pursuing || !college_id) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("================ 1");

    const [course] = await db("course")
      .where({ course_id })
      .update({
        course_name,
        year_of_pursuing,
        college_id,
      })
      .returning("*");
    console.log("================ 1");
    res.status(201).json({ data: { course } });
  } catch (error) {
    res.status(500).json({ message: "Error registering course", error });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { course_id } = req.body;
    const { user_type } = req.user;
    if (user_type !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    if (!course_id) {
      return res.status(400).json({ message: "Please provide course id" });
    }

    const deletedRow = await db("course").where("course_id", course_id).del();

    if (deletedRow) {
      return res.status(200).json({ message: "Course deleted successfully" });
    } else {
      return res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
  getAllCourses,
};
