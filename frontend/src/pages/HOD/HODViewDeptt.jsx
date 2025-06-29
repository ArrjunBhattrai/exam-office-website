import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import ReactModal from "react-modal";
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import "./hod.css";
import { BACKEND_URL } from "../../../config";
import { logoutUser } from "../../utils/logout";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import SessionDisplay from "../../components/SessionDisplay";
import { fetchLatestSession } from "../../utils/fetchSession"; 

const HODViewDeptt = () => {
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

  const dispatch = useDispatch();

  useEffect(() => {
  const loadSession = async () => {
    try {
      const session = await fetchLatestSession(token);
      dispatch(setSession(session));
    } catch (error) {
      console.error("Failed to load session", error);
    }
  };

  loadSession();
}, [dispatch, token]);

  const handleLogout = () => {
    logoutUser(dispatch);
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [filteredSubjects, setFilteredSujects] = useState([]);
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/faculty`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch faculties");
        }

        const data = await res.json();
        setFaculties(data);
      } catch (error) {
        console.error("Error fetching faculties: ", error);
        toast.error("Failed to fetch faculties");
      }
    };

    if (branchId) {
      fetchFaculties();
    }
  }, [branchId, token]);

  const openModal = async (faculty) => {
    setSelectedFaculty(faculty);
    setModalIsOpen(true);
    setSelectedCourse("");
    setAssignedSubjects([]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/course`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const options = data.courses.map((course) => ({
        value: JSON.stringify({
          course_id: course.course_id,
          specialization: course.specialization,
        }),
        label: `${course.course_name} (${course.specialization})`,
      }));
      setCourses(options);

      const subjectRes = await fetch(
        `${BACKEND_URL}/api/subject/${faculty.faculty_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const subjectData = await subjectRes.json();
      setAssignedSubjects(subjectData.subjects || []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      toast.error("Failed to load courses");
    }
  };

  const handleCourseChange = async (value) => {
    setSelectedCourse(value);
    const { course_id, specialization } = JSON.parse(value);

    const filtered = assignedSubjects.filter(
      (subj) =>
        String(subj.course_id) === String(course_id) &&
        String(subj.specialization) === String(specialization)
    );

    setFilteredSujects(filtered);
  };

  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);

  const handleViewStudents = async (subjectId, subjectType, facultyId) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/student/?subject_id=${subjectId}&subject_type=${subjectType}&faculty_id=${facultyId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setEnrolledStudents(data || []);
        setStudentsModalOpen(true);
      } else {
        toast.error(data.error || "Failed to fetch students");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to load students");
    }
  };

  return (
    <div className="home-container">
      <Toaster position="top-right" />
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
                    name: "Upload Electives Data",
                    path: "/hod/elective-data",
                  },
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
                  onClick={() =>
                    (window.location.href = "/edit-user-information")
                  }
                >
                  <FaPen className="icon" />
                  Edit Info
                </button>
                <button
                  className="icon-btn"
                  onClick={handleLogout}
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
                <SessionDisplay className="session-text" />

                <span className="box-overlay-text">
                  Select Option To View Details
                </span>

                <div className="faculty-box">
                  {faculties.length > 0 ? (
                    <ul className="faculty-list">
                      {faculties.map((faculty) => (
                        <li
                          key={faculty.faculty_id}
                          className="faculty-item"
                          onClick={() => openModal(faculty)}
                          style={{ cursor: "pointer" }}
                        >
                          <strong>{faculty.faculty_name}</strong> <br />
                          <span>ID: {faculty.faculty_id}</span> <br />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No faculty found for this branch.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <RedFooter />
      </div>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Faculty Details"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <h2>Faculty: {selectedFaculty?.faculty_name}</h2>

        <Dropdown
          label="Select Course"
          options={courses}
          selectedValue={selectedCourse}
          onChange={handleCourseChange}
        />

        {selectedCourse && (
          <>
            {assignedSubjects.length > 0 ? (
              <table className="subject-table">
                <thead>
                  <tr>
                    <th>Subject ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Semester</th>
                    <th>COs</th>
                    <th>Section(s)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(
                    filteredSubjects.reduce((acc, subject) => {
                      const key = ` ${subject.subject_id}-${subject.subject_type}-${subject.semester}`;
                      if (!acc[key]) {
                        acc[key] = {
                          ...subject,
                          sections: [subject.section],
                        };
                      } else {
                        acc[key].sections.push(subject.section);
                      }
                      return acc;
                    }, {})
                  ).map((subject) => (
                    <tr
                      key={`${subject.subject_id}-${subject.subject_type}-${subject.semester}`}
                    >
                      <td>{subject.subject_id}</td>
                      <td>{subject.subject_name}</td>
                      <td>{subject.subject_type}</td>
                      <td>{subject.semester}</td>
                      <td>{subject.co_names.length}</td>
                      <td>{subject.sections.join(", ")}</td>
                      <td>
                        <button
                          onClick={() =>
                            handleViewStudents(
                              subject.subject_id,
                              subject.subject_type,
                              selectedFaculty.faculty_id // pass faculty_id instead of section
                            )
                          }
                          className="view-btn"
                          style={{ marginBottom: "5px", display: "block" }}
                        >
                          View Students ({subject.sections.join(", ")})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No subjects assigned in this course.</p>
            )}
          </>
        )}

        <Button text="Close" onClick={() => setModalIsOpen(false)} />
      </ReactModal>

      <ReactModal
        isOpen={studentsModalOpen}
        onRequestClose={() => setStudentsModalOpen(false)}
        contentLabel="Enrolled Students"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <h3>Enrolled Students</h3>
        {enrolledStudents.length > 0 ? (
          <table className="student-table">
            <thead>
              <tr>
                <th>Enrollment No</th>
                <th>Student Name</th>
              </tr>
            </thead>
            <tbody>
              {enrolledStudents.map((student) => (
                <tr key={student.enrollment_no}>
                  <td>{student.enrollment_no}</td>
                  <td>{student.student_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students enrolled.</p>
        )}
        <Button text="Close" onClick={() => setStudentsModalOpen(false)} />
      </ReactModal>
    </div>
  );
};

export default HODViewDeptt;
