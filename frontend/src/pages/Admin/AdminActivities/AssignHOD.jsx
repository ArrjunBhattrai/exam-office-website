import React, { useEffect, useState } from "react";
import RedHeader from "../../../components/RedHeader";
import ActivityHeader from "../../../components/ActivityHeader";
import Sidebar from "../../../components/Sidebar";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import Dropdown from "../../../components/Dropdown"; // Ensure correct import
import { toast } from "react-toastify"; // Add toast for error messages

const AssignHOD = () => {
  const { officer_name, user_type, token } = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedHOD, setSelectedHOD] = useState(""); // To store selected faculty for HOD assignment

  useEffect(() => {
    fetchCourses();
    fetchFaculty();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchBranches(selectedCourse);
      setSelectedBranch(""); // Reset branch when course changes
    } else {
      setBranches([]);
    }
  }, [selectedCourse]);

  useEffect(() => {
    filterFaculty();
  }, [selectedCourse, selectedBranch, faculty]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/courses`, {
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
      const response = await fetch(`${BACKEND_URL}/api/branches?courseId=${courseId}`, {
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

  const fetchFaculty = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/faculty`, {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch faculty");
      const data = await response.json();
      setFaculty(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch faculty");
    }
  };

  const filterFaculty = () => {
    if (!selectedCourse || !selectedBranch) {
      setFilteredFaculty([]);
      return;
    }
    const filtered = faculty.filter(
      (fac) => fac.course_name === selectedCourse && fac.branch_name === selectedBranch
    );
    setFilteredFaculty(filtered);
  };

  const assignHOD = async () => {
    if (!selectedHOD) {
      toast.error("Please select a faculty member to assign as HOD.");
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/assign-hod`, {
        method: "POST",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faculty_id: selectedHOD,
          branch_id: selectedBranch,
        }),
      });

      if (!response.ok) throw new Error("Failed to assign HOD");

      toast.success("HOD assigned successfully!");
      setSelectedHOD(""); // Reset selection after assignment
    } catch (error) {
      toast.error(error.message || "Failed to assign HOD.");
    }
  };

  return (
    <div className="hod-home-container">
      <div className="hod-bg">
        <RedHeader />
        <div className="hod-content">
          <ActivityHeader />
          <div className="hod-main">
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
                <h3>Assign HOD</h3>
                <p className="session-text">Current Session: June 2025</p>

                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF TECHNOLOGY & SCIENCE
                  </p>

                  {/* Dropdowns for filtering */}
                  <div className="filter-section">
                    <Dropdown
                      label="Course"
                      options={courses.map((c) => c.course_name)}
                      selectedValue={selectedCourse}
                      onChange={setSelectedCourse}
                    />
                    <Dropdown
                      label="Branch"
                      options={branches.map((b) => b.branch_name)}
                      selectedValue={selectedBranch}
                      onChange={setSelectedBranch}
                      disabled={!selectedCourse}
                    />
                  </div>

                  {/* Faculty Table */}
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th>Faculty ID</th>
                        <th>Faculty Name</th>
                        <th>Course</th>
                        <th>Branch</th>
                        <th>Email</th>
                        <th>Assign</th>
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
                            <td>
                              <button onClick={() => setSelectedHOD(fac.faculty_id)}>Select</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No faculty found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <button onClick={assignHOD} disabled={!selectedHOD}>
                    Assign HOD
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignHOD;
