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
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

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

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({});
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [filteredSubjects, setFilteredSujects] = useState([]);
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/faculty/get-faculties?branch_id=${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
      const res = await fetch(
        `${BACKEND_URL}/api/course/get-courses-by-branch?branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        `${BACKEND_URL}/api/subject/assignedSubjects?faculty_id=${faculty.faculty_id}`,
        {
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
    const { course_id, specialization } = JSON.parse(value);

    setSelectedCourse({ course_id, specialization });

    const filtered = assignedSubjects.filter(
      (subj) =>
        String(subj.course_id) === String(course_id) &&
        String(subj.specialization) === String(specialization)
    );

    setFilteredSujects(filtered);
  };

  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);

  const handleViewStudents = async (subjectId, subjectType) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/student/getStudents/${subjectId}/${subjectType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setEnrolledStudents(data.students);
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
      <Toaster />
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
          selectedValue={JSON.stringify(selectedCourse)}
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.map((subject) => (
                    <tr key={subject.subject_id + subject.subject_type}>
                      <td>{subject.subject_id}</td>
                      <td>{subject.subject_name}</td>
                      <td>{subject.subject_type}</td>
                      <td>{subject.semester}</td>
                      <td>{subject.co_names.length}</td>
                      <td>
                        <button
                          onClick={() =>
                            handleViewStudents(
                              subject.subject_id,
                              subject.subject_type
                            )
                          }
                          className="view-btn"
                        >
                          View Students
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
