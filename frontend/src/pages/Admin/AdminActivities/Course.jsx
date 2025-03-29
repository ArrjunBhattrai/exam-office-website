import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../../../../config";
import RedHeader from "../../../components/RedHeader";
import ActivityHeader from "../../../components/ActivityHeader";
import Sidebar from "../../../components/Sidebar";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import RedFooter from "../../../components/RedFooter";
import "./admin.css";

const CourseManagement = () => {
  const {
    officer_id,
    isAuthenticated,
    officer_name,
    user_type,
    email,
    department_id,
    token,
  } = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course_name: "",
    year_of_pursuing: "",
    college_id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);

  console.log(token);
  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/course/courses`, {
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
      setCourses(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `${BACKEND_URL}/api/course/update/${editCourseId}`
        : `${BACKEND_URL}/api/course/create`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      toast.success(
        isEditing ? "Course updated successfully" : "Course added successfully"
      );

      fetchCourses();
      setFormData({ course_name: "", year_of_pursuing: "", college_id: "" });
      setIsEditing(false);
      setEditCourseId(null);
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleEdit = (course) => {
    setFormData(course);
    setIsEditing(true);
    setEditCourseId(course.course_id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

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
    <div className="hod-home-container">
      <div className="hod-bg">
        <RedHeader />
        <div className="hod-content">
          <ActivityHeader />
          <div className="hod-main">
            <div className="sidebars">
              <Sidebar
                className="sidebar-0"
                title="Admin Activities"
                activities={[
                  { name: "Course Management", path: "/course-management" },
                  { name: "Branch Management", path: "/branch-management" },
                  { name: "Session Management", path: "/session-management" },
                  { name: "Upload Marking Scheme", path: "/admin-upload" },
                  { name: "Faculty Management", path: "/faculty-management" },
                  { name: "Assign HOD", path: "/assign-hod" },
                  { name: "Upload Student Data", path: "/admin-upload" },
                  { name: "Address Requests", path: "/admin-req" },
                  { name: "Progress Report", path: "/admin-prog-report" },
                
            ]}
              />
            </div>
            <div className="hod-info">
              <div className="hod-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/admin-home")}
                >
                  <FaHome className="icon" />
                  Home
                </button>
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/")}
                >
                  <FaSignOutAlt className="icon" />
                  Logout
                </button>
              </div>

              <div className="hod-sec">
                <p>
                  <span>Welcome: </span>
                  <span className="hod-name">
                    {officer_name && `[${officer_name}]`}
                  </span>
                </p>
                <p>
                  <span className="hod-role">Role: </span>
                  <span className="hod-name">
                    [{(user_type && `${user_type}`) || "Please Login"}]
                  </span>
                </p>
              </div>
              <div className="fac-alloc">
                <h3>Course Management</h3>
                <p className="session-text">Current Session: June 2025</p>
                <span className="box-overlay-text">Add Details</span>
                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>
                  <div className="space-y-6">
                    <Toaster position="top-right" />

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4 p-4 bg-white rounded-lg shadow"
                    >
                      <input
                        type="text"
                        name="course_name"
                        value={formData.course_name}
                        onChange={handleChange}
                        placeholder="Course Name"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                      <input
                        type="number"
                        name="year_of_pursuing"
                        value={formData.year_of_pursuing}
                        onChange={handleChange}
                        placeholder="Year of Pursuing"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        name="college_id"
                        value={formData.college_id}
                        onChange={handleChange}
                        placeholder="College ID"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                      >
                        {isEditing ? "Update Course" : "Add Course"}
                      </button>
                    </form>

                    <div className="bg-white rounded-lg shadow">
                      <div className="subject-table-container">
                        <table className="subject-table">
                          <thead >
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Course Name
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Year of Pursuing
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                College ID
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {courses.map((course) => (
                              <tr key={course.course_id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {course.course_name}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {course.year_of_pursuing}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {course.college_id}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  <div className="flex space-x-3">
                                    <button
                                      onClick={() => handleEdit(course)}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDelete(course.course_id)
                                      }
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
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
