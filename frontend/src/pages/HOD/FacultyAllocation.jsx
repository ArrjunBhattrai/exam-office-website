import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import "./hod.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import { BACKEND_URL } from "../../../config";

const FacultyAllocation = () => {
  const { userId, isAuthenticated, role, token, branchId } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role != "hod") {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }

  const [subjectDetails, setSubjectDetails] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedFacultyIds, setSelectedFacultyIds] = useState([]);

  const toRoman = (num) => {
    const romanMap = {
      1: "I",
      2: "II",
      3: "III",
      4: "IV",
      5: "V",
      6: "VI",
      7: "VII",
      8: "VIII",
    };
    return romanMap[num] || num;
  };

  const fetchSubjectDetails = async () => {
    if (!selectedCourse) return;

    const selected = courses.find((c) => c.value === selectedCourse);
    if (!selected) return;

    const [course_id, specialization] = selectedCourse.split("|");

    const query = `?branch_id=${branchId}&course_id=${course_id}&specialization=${specialization}`;

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/subject/get-subjects-by-course${query}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }

      const data = await response.json();
      setSubjectDetails(data.subjects);
    } catch (error) {
      toast.error(error.message || "Failed to fetch subjects");
    }
  };
  useEffect(() => {
    if (selectedCourse) fetchSubjectDetails();
  }, [selectedCourse, token]);

  const fetchFaculties = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/faculty/get-faculties?branch_id=${branchId}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch faculties");
      }

      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch Faculties");
    }
  };
  useEffect(() => {
    if (selectedSubject) {
      fetchFaculties();
    }
  }, [selectedSubject, token]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/course/get-courses-byBranch?branch_id=${branchId}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      const formatted = data.courses.map((c) => ({
        label: `${c.course_name} (${c.specialization})`,
        value: `${c.course_id}|${c.specialization}`,
      }));

      setCourses(formatted);
    } catch (error) {
      toast.error(error.message || "Failed to fetch courses");
    }
  };
  useEffect(() => {
    fetchCourses();
  }, [token]);

  const handleAssignment = async (facultyIds, subject_id, subject_type) => {
    if (!selectedSubject) return;

    const body = {
      faculty_ids: facultyIds,
      subject_id,
      subject_type,
    };

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/faculty/assign-faculties`,
        {
          method: "POST",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign faculty");
      }

      toast.success(`Assigned to ${selectedSubject.subject_name} successfully`);
      setSelectedFacultyIds([]);
      await fetchSubjectDetails();
      await fetchFaculties();
      setShowModal(false);
    } catch (error) {
      toast.error(error.message || "Assignment failed");
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
                className="sidebar-1"
                title="HOD Activity"
                activities={[
                  {
                    name: "View Department Details",
                    path: "/hod/department-details",
                  },
                  {
                    name: "Registration Requests",
                    path: "/hod/registration-request",
                  },
                  {
                    name: "Faculty Allocation",
                    path: "/hod/faculty-allocation",
                  },
                  {
                    name: "View Correction Requests",
                    path: "/hod/correction-request",
                  },
                  { name: "Progress Report", path: "/hod/progress-report" },
                ]}
              />
            </div>

            <div className="user-info">
              <div className="user-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/hod-home")}
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
                  <span className="user-name">{userId && [`${userId}`]}</span>
                </p>

                <p>
                  <span className="user-role">Role: </span>
                  <span className="user-name">[{role && `${role}`}]</span>
                </p>
              </div>

              <div className="fac-alloc">
                <h3>Faculty Allocation</h3>
                <p className="session-text">Current Session: June 2025</p>

                <span className="box-overlay-text">
                  Select Option To View Details
                </span>

                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>

                  <Dropdown
                    label="Course"
                    options={courses}
                    selectedValue={selectedCourse}
                    onChange={setSelectedCourse}
                  />

                  {selectedCourse && (
                    <>
                      <table className="subject-table">
                        <thead>
                          <tr>
                            <th>Subject Code</th>
                            <th>Subject Name</th>
                            <th>Subject Type</th>
                            <th>Semester</th>
                            <th>Faculties Assigned</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjectDetails.map((subject) => {
                            const isAssigned =
                              subject.faculty_names?.length > 0;

                            return (
                              <tr
                                key={`${subject.subject_id}-${subject.subject_type}`}
                              >
                                <td>{subject.subject_id}</td>
                                <td>{subject.subject_name}</td>
                                <td>{subject.subject_type}</td>
                                <td>{toRoman(subject.semester)}</td>
                                <td>
                                  {subject.faculty_names?.length > 0
                                    ? subject.faculty_names.join(", ")
                                    : "Not Assigned Yet"}
                                </td>
                                <td>
                                  <Button
                                    text={isAssigned ? "Edit" : "Assign"}
                                    onClick={() => {
                                      setSelectedSubject(subject);
                                      setSelectedFacultyIds(
                                        subject.faculty_ids || []
                                      );
                                      setShowModal(true);
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {showModal && selectedSubject && (
                        <div className="modal-overlay">
                          <div className="modal-content">
                            <h3>
                              {selectedSubject.faculty_id
                                ? "Edit Assigned Faculty"
                                : "Assign Subject to Faculty"}
                            </h3>

                            <p>
                              <strong>Subject:</strong>{" "}
                              {selectedSubject.subject_name}
                            </p>
                            <p>
                              <strong>Code:</strong>{" "}
                              {selectedSubject.subject_id}
                            </p>
                            <p>
                              <strong>Type:</strong>{" "}
                              {selectedSubject.subject_type}
                            </p>

                            <div className="faculty-list">
                              <h4>Faculties:</h4>
                              {faculties.map((faculty) => {
                                const isSelected = selectedFacultyIds.includes(
                                  faculty.faculty_id
                                );

                                return (
                                  <div
                                    key={faculty.faculty_id}
                                    className={`faculty-item ${
                                      isSelected ? "selected" : ""
                                    }`}
                                    onClick={() => {
                                      setSelectedFacultyIds((prev) =>
                                        isSelected
                                          ? prev.filter(
                                              (id) => id !== faculty.faculty_id
                                            )
                                          : prev.length < 2
                                          ? [...prev, faculty.faculty_id]
                                          : prev
                                      );
                                    }}
                                  >
                                    {faculty.faculty_id} -{" "}
                                    {faculty.faculty_name}
                                  </div>
                                );
                              })}
                            </div>

                            <button
                              className="confirm-btn"
                              onClick={() =>
                                handleAssignment(
                                  selectedFacultyIds,
                                  selectedSubject.subject_id,
                                  selectedSubject.subject_type
                                )
                              }
                              disabled={
                                selectedFacultyIds.length === 0 ||
                                selectedFacultyIds.length > 2
                              }
                            >
                              Confirm Assignment
                            </button>

                            <div className="modal-actions">
                              <button
                                className="close-btn"
                                onClick={() => {
                                  setShowModal(false);
                                  setSelectedSubject(null);
                                  setSelectedFacultyIds([]);
                                }}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
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

export default FacultyAllocation;
