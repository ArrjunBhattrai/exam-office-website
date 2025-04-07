import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./hod.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import ReactModal from "react-modal";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const HODViewDeptt = () => {
  //to be removed:
  const user = useSelector((state) => state.auth.user); // Get logged-in user

  // const { userId, isAuthenticated, role, token } = useSelector(
  //           (state) => state.auth
  //         );

  //         if (!isAuthenticated) {
  //           return <div>Please log in to access this page.</div>;
  //         }

  //sample data:
  const [subjects, setSubjects] = useState([
    {
      subject_id: "CS101",
      subject_name: "Data Structures",
      subject_type: "T",
      faculty: { faculty_id: "F001", faculty_name: "Dr. A Sharma" },
    },
    {
      subject_id: "CS202",
      subject_name: "Computer Networks",
      subject_type: "T",
      faculty: { faculty_id: "F002", faculty_name: "Ms. B Verma" },
    },
  ]);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [students, setStudents] = useState([
    { enrollment_no: "IT01", student_name: "ABC" },
    { enrollment_no: "IT02", student_name: "XYZ" },
  ]);

  const [semester, setSemester] = useState("");

  const openModal = (subject) => {
    setSelectedSubject(subject);
    setModalIsOpen(true);

    // backend fetch will happen
    // fetch(`/api/getStudents?subject_id=${subject.subject_id}`)
    //   .then(res => res.json())
    //   .then(data => setStudents(data));
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedSubject(null);
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
                    path: "/hod/department/details",
                  },
                  { name: "Faculty Allocation", path: "/hod/faculcty-allocation" },
                  { name: "Registration Requests", path: "/hod/registration-request" },
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
                      options={[
                        "I",
                        "II",
                        "III",
                        "IV",
                        "V",
                        "VI",
                        "VII",
                        "VIII",
                      ]}
                      selectedValue={semester}
                      onChange={setSemester}
                    />
                  </div>

                  <div>
                    
                    {semester && (
                      <>
                      <div className="details-table-container">
                      <table className="subject-table">
                        <thead>
                          <tr>
                            <th>S. No.</th>
                            <th>Subject Code & Name</th>
                            <th>Faculty Assigned</th>
                            <th>Students Enrolled</th>
                          </tr>
                        </thead>

                        <tbody>
                          {subjects.map((subject, index) => (
                            <tr key={subject.subject_id}>
                              <td>{index + 1}</td>
                              <td>{`${subject.subject_id} - ${subject.subject_name}`}</td>
                              <td>{subject.faculty?.faculty_name}</td>
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
                        {selectedSubject?.subject_name || "Selected Subject"}
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
