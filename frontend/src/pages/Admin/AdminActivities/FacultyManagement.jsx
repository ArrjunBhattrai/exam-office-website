import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { BACKEND_URL } from "../../../../config";
import { useSelector } from "react-redux";
import RedHeader from "../../../components/RedHeader";
import ActivityHeader from "../../../components/ActivityHeader";
import Sidebar from "../../../components/Sidebar";
import Dropdown from "../../../components/Dropdown";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import RedFooter from "../../../components/RedFooter";

const FacultyManagement = () => {
  const { officer_name, user_type, token } = useSelector((state) => state.auth);

  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    faculty_name: "",
    email: "",
    course_id: "",
    branch_id: "",
  });

  useEffect(() => {
    fetchFaculty();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchBranches(selectedCourse);
    } else {
      setBranches([]);
      setSelectedBranch(""); // Reset branch selection when no course is selected
    }
  }, [selectedCourse]);

  useEffect(() => {
    filterFaculty();
  }, [selectedCourse, selectedBranch, faculty]);

  const fetchFaculty = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/...`, {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch faculties");

      const data = await response.json();
      setFaculty(data);
      setFilteredFaculty(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch faculties");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/...`, {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch courses");
    }
  };

  const fetchBranches = async (courseId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/...`, {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch branches");

      const data = await response.json();
      setBranches(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch branches");
    }
  };

  const filterFaculty = () => {
    let filtered = faculty;

    if (selectedCourse) {
      filtered = filtered.filter((fac) => fac.course_id === selectedCourse);
    }
    if (selectedBranch) {
      filtered = filtered.filter((fac) => fac.branch_id === selectedBranch);
    }

    setFilteredFaculty(filtered);
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URL}/api/faculty/add`, {
        method: "POST",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFaculty),
      });

      if (!response.ok) throw new Error("Failed to add faculty");

      toast.success("Faculty added successfully");
      setShowAddFaculty(false);
      fetchFaculty(); // Refresh faculty list
    } catch (error) {
      toast.error(error.message || "Failed to add faculty");
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
                <button className="icon-btn" onClick={() => (window.location.href = "/admin-home")}>
                  <FaHome className="icon" />
                  Home
                </button>
                <button className="icon-btn" onClick={() => (window.location.href = "/")}>
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
                <h3>Faculty Management</h3>
                <p className="session-text">Current Session: June 2025</p>
                <span className="box-overlay-text">Manage Details</span>
                
                {/* 🔽 FACULTY TABLE 🔽 */}
                <div className="faculty-box">
                <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>
                <div className="filter-section">
                <Dropdown
                  label="Course"
                  options={courses.map((c) => c.course_name)}
                  selectedValue={selectedCourse}
                  onChange={(value) => setSelectedCourse(value)}
                />
                <Dropdown
                  label="Branch"
                  options={branches.map((b) => b.branch_name)}
                  selectedValue={selectedBranch}
                  onChange={(value) => setSelectedBranch(value)}
                  disabled={!selectedCourse} // Disable if no course is selected
                />
                </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th>Faculty ID</th>
                        <th>Faculty Name</th>
                        <th>Course</th>
                        <th>Branch</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFaculty.length > 0 ? (
                        filteredFaculty.map((fac) => (
                          <tr key={fac.faculty_id}>
                            <td>{fac.faculty_id}</td>
                            <td>{fac.faculty_name}</td>
                            <td>{fac.course_name}</td>
                            <td>{fac.branch_name}</td>
                            <td>{fac.email}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No faculty found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <button
                className="add-faculty-btn"
                onClick={() => setShowAddFaculty(true)}
              >
                + Add Faculty
              </button>
              {showAddFaculty && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Faculty</h2>
            <form onSubmit={handleAddFaculty}>
              <input
                type="text"
                placeholder="Faculty Name"
                value={newFaculty.faculty_name}
                onChange={(e) =>
                  setNewFaculty({ ...newFaculty, faculty_name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newFaculty.email}
                onChange={(e) =>
                  setNewFaculty({ ...newFaculty, email: e.target.value })
                }
                required
              />
              <select
                value={newFaculty.course_id}
                onChange={(e) =>
                  setNewFaculty({ ...newFaculty, course_id: e.target.value })
                }
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
              </select>

              <button type="submit">Add Faculty</button>
              <button
                type="button"
                onClick={() => setShowAddFaculty(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
              
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

export default FacultyManagement;
