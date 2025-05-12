import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./hod.css";
import { BACKEND_URL } from "../../../config";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import ReactModal from "react-modal";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

const HODViewDeptt = () => {
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
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [students, setStudents] = useState([]);

  const openModal = (subject) => {
    setSelectedSubject(subject);
    setStudents(subject.students_enrolled);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedSubject(null);
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

  const fetchDepartmentDetails = async () => {
    if (!selectedSemester) return;

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/hod/branch/details/${selectedSemester}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch department details");

      const data = await response.json();
      setSubjects(data.details);
    } catch (error) {
      toast.error(
        error.message || "Something went wrong while fetching subjects"
      );
    }
  };

  useEffect(() => {
    fetchDepartmentDetails();
  }, [selectedSemester, token]);

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
                  onClick={() => (window.location.href = "/hod/home")}
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
                  <span className="user-name">{userId && `[${userId}]`}</span>
                </p>

                <p>
                  <span className="user-role">Role: </span>
                  <span className="user-name">[{role && `${role}`}]</span>
                </p>
              </div>

              <div className="fac-alloc">
                <h3>Department Details</h3>
                <p className="session-text">Current Session: June 2025</p>

                <span className="box-overlay-text">
                  Select Option To View Details
                </span>

                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>

                  <div className="dropdown-container">
                    <Dropdown
                      label="Semester"
                      options={semesterOptions}
                      selectedValue={selectedSemester}
                      onChange={setSelectedSemester}
                    />
                  </div>

                  <div>
                    {selectedSemester && (
                      <>
                        <div className="details-table-container">
                          <table className="subject-table">
                            <thead>
                              <tr>
                                <th>Subject Code</th>
                                <th>Subject Type</th>
                                <th>Subject Name</th>
                                <th>Faculty Assigned</th>
                                <th>Students Enrolled</th>
                              </tr>
                            </thead>

                            <tbody>
                              {subjects.map((subject, index) => (
                                <tr
                                  key={`${subject.subject_id}_${subject.subject_type}`}
                                >
                                  <td>{subject.subject_id}</td>
                                  <td>{subject.subject_type}</td>
                                  <td>{subject.subject_name}</td>
                                  <td>
                                    {subject.faculty_assigned?.faculty_name ||
                                      "No faculty assigned yet"}
                                  </td>{" "}
                                  <td>
                                    <Button
                                      text="View Students"
                                      onClick={() => openModal(subject)}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <ReactModal
                          isOpen={modalIsOpen}
                          onRequestClose={closeModal}
                          contentLabel="Student List Modal"
                          className="custom-modal"
                          overlayClassName="custom-overlay"
                        >
                          <h2>
                            Students Enrolled in:{" "}
                            {selectedSubject?.subject_name ||
                              "Selected Subject"}
                          </h2>
                          <table className="student-table">
                            <thead>
                              <tr>
                                <th>Enrollment No</th>
                                <th>Student Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {students.map((student) => (
                                <tr key={student.enrollment_no}>
                                  <td>{student.enrollment_no}</td>
                                  <td>{student.student_name}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <Button text="Close" onClick={closeModal} />
                        </ReactModal>
                      </>
                    )}
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

export default HODViewDeptt;
