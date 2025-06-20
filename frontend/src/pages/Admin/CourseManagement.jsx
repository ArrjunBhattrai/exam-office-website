import  { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../../../config";
import RedHeader from "../../components/RedHeader";
import ActivityHeader from "../../components/ActivityHeader";
import Sidebar from "../../components/Sidebar";
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import RedFooter from "../../components/RedFooter";
import "./admin.css";

const CourseManagement = () => {
  const { userId, isAuthenticated, role, token } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role != "admin") {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }
  const currentSession = useSelector((state) => state.session.currentSession);

  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    branch_id: "",
    course_id: "",
    course_name: "",
    specialization: "",
    no_of_semester: "",
  });

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/course`, {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      toast.error(error.message || "Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/course`, {
        method: "POST",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add course");
      }

      toast.success("Course added successfully");
      fetchCourses();
      setFormData({
        branch_id: "",
        course_id: "",
        course_name: "",
        specialization: "",
        no_of_semester: "",
      });
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (branch_id, course_id, specialization) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/course/?branch_id=${encodeURIComponent(
          branch_id
        )}&course_id=${encodeURIComponent(
          course_id
        )}&specialization=${encodeURIComponent(specialization)}`,
        {
          method: "DELETE",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete course");
      }

      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      toast.error(error.message || "Failed to delete course");
    }
  };

  return (
    <div className="home-container">
      <div className="user-bg">
        <RedHeader />
        <div className="user-content">
          <ActivityHeader />
          <div className="user-main">
            <div className="sidebars">
              <Sidebar
                className="sidebar"
                title="Admin Activities"
                activities={[
                  {
                    name: "Session Management",
                    path: "/admin/session-management",
                  },
                  {
                    name: "Branch Management",
                    path: "/admin/branch-management",
                  },
                  {
                    name: "Course Management",
                    path: "/admin/course-management",
                  },
                  {
                    name: "Upload Subject Data",
                    path: "/admin/subject-data-upload",
                  },
                  {
                    name: "Upload Student Data",
                    path: "/admin/student-data-upload",
                  },
                  {
                    name: "Upload Data for ATKT",
                    path: "/admin/atkt-data-upload",
                  },
                  { name: "Address Requests", path: "/admin/req" },
                ]}
              />
            </div>
            <div className="user-info">
              <div className="user-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/admin-home")}
                >
                  <FaHome className="icon" />
                  Home
                </button>
                <button
                  className="icon-btn"
                  onClick={() =>
                    (window.location.href = "/edit-user-information")
                  }
                >
                  <FaPen className="icon" />
                  Edit Info
                </button>
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/")}
                >
                  <FaSignOutAlt className="icon" />
                  Logout
                </button>
              </div>
              <div className="user-sec">
                <p>
                  <span>Welcome: </span>
                  <span className="user-name">{userId && `[${userId}]`}</span>
                </p>
                <p>
                  <span className="user-role">Role: </span>
                  <span className="user-name">
                    [{(role && `${role}`) || "Please Login"}]
                  </span>
                </p>
              </div>
              <div className="fac-alloc">
                <h3>Course Management</h3>
                <p className="session-text">
                  Current Session:{" "}
                  {currentSession
                    ? `${currentSession.start_month}/${currentSession.start_year} - ${currentSession.end_month}/${currentSession.end_year}`
                    : "Loading..."}
                </p>

                <span className="box-overlay-text">Add Details</span>
                <div className="faculty-box">
                  <div className="space-y-6">
                    <Toaster position="top-right" />
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4 p-4 bg-white rounded-lg shadow"
                    >
                      <input
                        type="text"
                        name="branch_id"
                        value={formData.branch_id}
                        onChange={handleChange}
                        placeholder="Branch Id"
                        className="input-fac w-full px-3 py-2 border rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        name="course_id"
                        value={formData.course_id}
                        onChange={handleChange}
                        placeholder="Course Id"
                        className="input-fac w-full px-3 py-2 border rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        name="course_name"
                        value={formData.course_name}
                        onChange={handleChange}
                        placeholder="Course Name"
                        className="input-fac w-full px-3 py-2 border rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="Specialization"
                        className="input-fac w-full px-3 py-2 border rounded-lg"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                      >
                        Add Course
                      </button>
                    </form>
                    <div className="bg-white rounded-lg shadow">
                      <div className="subject-table-container">
                        <table className="subject-table">
                          <thead>
                            <tr>
                              <th>Branch Id</th>
                              <th>Branch Name</th>
                              <th>Course Id</th>
                              <th>Course Name</th>
                              <th>Specialization</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {courses.map((course) => (
                              <tr
                                key={`${course.branch_id}-${course.course_id}-${course.specialization}`}
                              >
                                <td>{course.branch_id}</td>
                                <td>{course.branch_name}</td>
                                <td>{course.course_id}</td>
                                <td>{course.course_name}</td>
                                <td>{course.specialization}</td>
                                <td>
                                  <button
                                    onClick={() =>
                                      handleDelete(
                                        course.branch_id,
                                        course.course_id,
                                        course.specialization
                                      )
                                    }
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RedFooter />
      </div>
    </div>
  );
};

export default CourseManagement;
