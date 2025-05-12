import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
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

  const [semesterOptions, setSemesterOptions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjectDetails, setSubjectDetails] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const fetchSemesters = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/hod/branch/semesters`, {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch semesters");
      }
      const responseData = await response.json();
      const semesters = responseData.semesters;
      const formatted = semesters.map((s) => ({
        label: toRoman(s),
        value: s,
      }));
      setSemesterOptions(formatted);
    } catch (error) {
      toast.error(error.message || "Failed to fetch semesters");
    }
  };
  useEffect(() => {
    fetchSemesters();
  }, [token]);

  const fetchSubjectDetailsBySemester = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/hod/branch/subjects/${selectedSemester}`,
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
    if (selectedSemester) {
      fetchSubjectDetailsBySemester();
    }
  }, [selectedSemester, token]);

  const fetchFaculties = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/hod/branch/faculties`, {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

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
    if (selectedSemester) {
      fetchFaculties();
    }
  }, [selectedSemester, token]);

  const handleAssignment = async (faculty, subject_id, subject_type) => {
    if (!selectedSubject) return;

    const body = {
      faculty_id: faculty.faculty_id,
      subject_id,
      subject_type,
    };

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/hod/faculty-assignment`,
        {
          method: "POST",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign faculty");
      }

      toast.success(
        `${faculty.faculty_name} assigned to ${selectedSubject.subject_name}`
      );

      fetchSubjectDetailsBySemester();
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
                    label="Semester"
                    options={semesterOptions}
                    selectedValue={selectedSemester}
                    onChange={setSelectedSemester}
                  />

                  {selectedSemester && (
                    <>
                      <table className="subject-table">
                        <thead>
                          <tr>
                            <th>Subject Code</th>
                            <th>Subject Name</th>
                            <th>Subject Type</th>
                            <th>Faculty Assigned</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjectDetails.map((subject) => {
                            const isAssigned =
                              subject.faculty_id && subject.faculty_name;

                            return (
                              <tr
                                key={`${subject.subject_id}-${subject.subject_type}`}
                              >
                                <td>{subject.subject_id}</td>
                                <td>{subject.subject_name}</td>
                                <td>{subject.subject_type}</td>
                                <td>
                                  {isAssigned
                                    ? subject.faculty_name
                                    : "Not Assigned Yet"}
                                </td>
                                <td>
                                  <Button
                                    text={isAssigned ? "Edit" : "Assign"}
                                    onClick={() => {
                                      setSelectedSubject(subject);
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
                              {faculties.map((faculty) => (
                                <div
                                  key={faculty.faculty_id}
                                  className="faculty-item"
                                  onClick={() =>
                                    handleAssignment(
                                      faculty,
                                      selectedSubject.subject_id,
                                      selectedSubject.subject_type
                                    )
                                  }
                                >
                                  {faculty.faculty_id} - {faculty.faculty_name}
                                </div>
                              ))}
                            </div>

                            <div className="modal-actions">
                              <button
                                className="close-btn"
                                onClick={() => setShowModal(false)}
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
