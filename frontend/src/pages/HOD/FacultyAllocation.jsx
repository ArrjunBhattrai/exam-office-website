import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./hod.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const FacultyAllocation = () => {
  const { userId, isAuthenticated, role, token } = useSelector(
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
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!selectedSemester) return;

    // Simulating API call with sample data
    const sampleFaculties = [
      { faculty_id: "F001", faculty_name: "Dr. ABC" },
      { faculty_id: "F002", faculty_name: "Prof. XYZ" },
      { faculty_id: "F003", faculty_name: "Dr. UVW" },
    ];

    const sampleSubjects = [
      {
        subject_id: "CS301",
        subject_name: "Data Structures",
        subject_type: "Theory",
        semester: "III",
      },
      {
        subject_id: "CS302",
        subject_name: "Database Management Systems",
        subject_type: "Theory",
        semester: "III",
      },
      {
        subject_id: "CS303",
        subject_name: "Operating Systems Lab",
        subject_type: "Practical",
        semester: "III",
      },
    ];

    // Filter subjects based on selected semester (for realism)
    const filteredSubjects = sampleSubjects.filter(
      (subject) => subject.semester === semester
    );

    setFaculties(sampleFaculties);
    setSubjects(filteredSubjects);
  }, [semester]);

  const handleSubmit = async () => {
    const payload = Object.entries(assignments).map(([subject_id, faculty]) => {
      const subject = subjects.find((s) => s.subject_id === subject_id);
      return {
        faculty_id: faculty.faculty_id,
        subject_id: subject.subject_id,
        subject_type: subject.subject_type,
      };
    });

    try {
      await axios.post("http://localhost:8080/api/faculty-allocation", payload);
      alert("Allocation submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

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
      const response = await fetch(`${BACKEND_URL}/api/hod/semesters`, {
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
                    path: "/hod-deptt-details",
                  },
                  { name: "Registration Requests", path: "/hod-reg-req" },

                  { name: "Faculty Allocation", path: "/hod-fac-alloc" },
                  {
                    name: "View Correction Requests",
                    path: "/hod-correction-req",
                  },
                  { name: "Progress Report", path: "/hod-prog-report" },
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
                  <span className="user-name">
                    [{user?.name || "Please Login"}]
                  </span>
                </p>
                <p>
                  <span className="user-role">Role: </span>
                  <span className="user-name">
                    [{user?.role || "Please Login"}]
                  </span>
                </p>
                <p>
                  <span className="user-role">Department: </span>
                  <span className="user-name">
                    [{user?.department || "Please Login"}]
                  </span>
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
                      {/* here i want a table
                      the table heads are:
                      
                      */}

                      <table className="subject-table">
                        <thead>
                          <tr>
                            <th>S. No.</th>
                            <th>Subject Code - Name</th>
                            <th>Type</th>
                            <th>Assigned To</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map((subject, index) => (
                            <tr
                              key={
                                $subject / subject_id - $subject.subject_type
                              }
                            >
                              <td>{index + 1}</td>
                              <td>
                                {subject.subject_id} - {subject.subject_name}
                              </td>
                              <td>{subject.subject_type}</td>
                              <td>
                                {assignments[subject.subject_id]
                                  ?.faculty_name || "Not Assigned"}
                              </td>
                              <td>
                                <Button
                                  text="Assign"
                                  onClick={() => {
                                    setSelectedSubject(subject);
                                    setShowModal(true);
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {showModal && selectedSubject && (
                        <div className="modal-overlay">
                          <div className="modal-content">
                            <h3>Assign Faculty to Subject</h3>
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

                            <select
                              onChange={(e) => {
                                const selectedFac = faculties.find(
                                  (f) => f.faculty_id === e.target.value
                                );
                                setAssignments((prev) => ({
                                  ...prev,
                                  [selectedSubject.subject_id]: selectedFac,
                                }));
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Select Faculty
                              </option>
                              {faculties.map((faculty) => (
                                <option
                                  key={faculty.faculty_id}
                                  value={faculty.faculty_id}
                                >
                                  {faculty.faculty_name}
                                </option>
                              ))}
                            </select>

                            <div className="modal-actions">
                              <button onClick={() => setShowModal(false)}>
                                Save & Close
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      <Button text="Submit Allocation" onClick={handleSubmit} />
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
