import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../../../config";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course_name: "",
    year_of_pursuing: "",
    college_id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const { token } = useSelector((state) => state.auth);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/courses`, {
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
        ? `${BACKEND_URL}/api/courses/${editCourseId}`
        : `${BACKEND_URL}/api/courses`;

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
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
      </div>

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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year of Pursuing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  College ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.course_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.course_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.year_of_pursuing}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.college_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.course_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
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
  );
};

export default CourseManagement;
