import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, UserPlus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { BACKEND_URL } from "../../../config";
import { useSelector } from "react-redux";
import RedHeader from "../../components/RedHeader";
import ActivityHeader from "../../components/ActivityHeader";
import Sidebar from "../../components/Sidebar";
import Dropdown from "../../components/Dropdown";
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import RedFooter from "../../components/RedFooter";
import "./admin.css";
import SessionDisplay from "../../components/SessionDisplay";

const SessionManagement = () => {
  const { userId, isAuthenticated, role, token } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role != "admin") {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }
  
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [sessions, setSessions] = useState([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [allSessions, setAllSessions] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [allBranches, setAllBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [testComponents, setTestComponents] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [dataToDownload, setDataToDownload] = useState({
    subjects: false,
    electives: false,
    subjectCOs: false,
    testMarks: false,
    coMarks: false,
    atktMarks: false,
    students: false,
    studentElectives: false,
  });

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { label: year.toString(), value: year };
  });

  const filteredCourses = selectedBranchId
    ? allCourses.filter((course) => course.branch_id === selectedBranchId)
    : [];

  const handleAddSession = async () => {
    if (!startMonth || !startYear || !endMonth || !endYear) {
      toast.error("All fields are required!");
      return;
    }

    const newSession = {
      start_month: startMonth,
      start_year: startYear,
      end_month: endMonth,
      end_year: endYear,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSession),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Session added successfully!");
        setSessions([...sessions, data.session]);
        setStartMonth("");
        setStartYear("");
        setEndMonth("");
        setEndYear("");
        dispatch(setSession(data.session));
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  const fetchSections = async (branchId, courseId, specialization) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/course/?branch_id=${branchId}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      const courses = data.courses || [];

      const matchedCourse = courses.find(
        (c) => c.course_id === courseId && c.specialization === specialization
      );

      setSections(matchedCourse?.sections || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch sections");
    }
  };

  const fetchDownloadModalData = async () => {
    try {
      const sessionRes = await fetch(`${BACKEND_URL}/api/session/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const branchRes = await fetch(`${BACKEND_URL}/api/branch/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const courseRes = await fetch(`${BACKEND_URL}/api/course/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const semesterRes = await fetch(`${BACKEND_URL}/api/semester/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const componentRes = await fetch(
        `${BACKEND_URL}/api/assesment/components`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sessionsData = await sessionRes.json();
      const branches = await branchRes.json();
      const courses = await courseRes.json();
      const semesters = await semesterRes.json();
      const componentData = await componentRes.json();

      const allSessions = sessionsData.sessions || [];
      setAllSessions(allSessions);
      setAllBranches(branches || []);
      setAllCourses(courses.courses || []);
      setSemesters(semesters || []);
      setTestComponents(componentData.components || []);

      if (allSessions.length > 0) {
        const sorted = [...allSessions].sort((a, b) => {
          if (a.start_year !== b.start_year) {
            return b.start_year - a.start_year;
          }
          return b.start_month - a.start_month;
        });
        dispatch(setSession(sorted[0]));
      }
    } catch (err) {
      toast.error("Failed to load session, branch, semester or course data");
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
                className="sidebar-0"
                title="Admin Activities"
                activities={[
                  {
                    name: "Session Management",
                    path: "/admin/session-management",
                  },
                  {
                    name: "Branch Management",
                    path: "/admin/branch-management",
                  },
                  {
                    name: "Course Management",
                    path: "/admin/course-management",
                  },
                  {
                    name: "Upload Subject Data",
                    path: "/admin/subject-data-upload",
                  },
                  {
                    name: "Upload Student Data",
                    path: "/admin/student-data-upload",
                  },
                  {
                    name: "Upload Data for ATKT",
                    path: "/admin/atkt-data-upload",
                  },
                  { name: "Address Requests", path: "/admin/req" },
                ]}
              />
            </div>
            <div className="user-info">
              <div className="user-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/admin-home")}
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
                  <span className="user-name">
                    [{(role && `${role}`) || "Please Login"}]
                  </span>
                </p>
              </div>
              <div className="fac-alloc">
                <h3>Session Management</h3>
                <SessionDisplay className="session-text" />
                <span className="box-overlay-text">Add Details</span>
                <div className="faculty-box">
                  <div className="session-form">
                    <Dropdown
                      label="Start Month"
                      options={months}
                      selectedValue={startMonth}
                      onChange={(value) => setStartMonth(Number(value))}
                    />
                    <Dropdown
                      label="Start Year"
                      options={yearOptions}
                      selectedValue={startYear}
                      onChange={(value) => setStartYear(Number(value))}
                    />
                    <Dropdown
                      label="End Month"
                      options={months}
                      selectedValue={endMonth}
                      onChange={(value) => setEndMonth(Number(value))}
                    />
                    <Dropdown
                      label="End Year"
                      options={yearOptions}
                      selectedValue={endYear}
                      onChange={(value) => setEndYear(Number(value))}
                    />

                    <button
                      className="upload-button"
                      onClick={handleAddSession}
                    >
                      Add Session
                    </button>
                  </div>
                  <div className="download-session">
                    <h4>Download Previous Session Data:</h4>
                    <button
                      className="upload-button"
                      onClick={() => {
                        fetchDownloadModalData(); // Fetch dropdown data
                        setShowDownloadModal(true);
                      }}
                    >
                      Select Session to Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RedFooter />

        {showDownloadModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Select Session and Details</h2>

              <Dropdown
                label="Session"
                options={allSessions.map((s) => ({
                  label: `${monthNames[s.start_month]} ${s.start_year} - ${
                    monthNames[s.end_month]
                  } ${s.end_year}`,
                  value: s.session_id,
                }))}
                selectedValue={selectedSessionId}
                onChange={setSelectedSessionId}
              />

              <Dropdown
                label="Branch"
                options={allBranches.map((b) => ({
                  label: b.branch_name,
                  value: b.branch_id,
                }))}
                selectedValue={selectedBranchId}
                onChange={(branchId) => {
                  setSelectedBranchId(branchId);
                  setSelectedCourseId(""); // reset course when branch changes
                }}
              />

              <Dropdown
                label="Course"
                options={filteredCourses.map((c) => ({
                  label: `${c.course_name} ${c.specialization}`,
                  value: c.course_id,
                }))}
                selectedValue={selectedCourseId}
                onChange={(courseId) => {
                  setSelectedCourseId(courseId);
                  setSelectedSection(""); // reset section
                  const selectedCourse = filteredCourses.find(
                    (c) => c.course_id === courseId
                  );
                  if (selectedBranchId && selectedCourse?.specialization) {
                    fetchSections(
                      selectedBranchId,
                      courseId,
                      selectedCourse.specialization
                    );
                  }
                }}
              />

              <Dropdown
                label="Semester"
                options={semesters.map((s) => ({
                  label: `Semester ${s}`,
                  value: s,
                }))}
                selectedValue={selectedSemester}
                onChange={setSelectedSemester}
              />

              <Dropdown
                label="Section"
                options={sections.map((s) => ({ value: s, label: s }))}
                selectedValue={selectedSection}
                onChange={setSelectedSection}
              />

              <h5>Choose What to Include in Download:</h5>
              <div className="checkbox-wrapper">
                <div className="checkbox-group">
                  <strong>Subjects</strong>
                  <label>
                    <input
                      type="checkbox"
                      checked={dataToDownload.subjects}
                      onChange={(e) =>
                        setDataToDownload({
                          ...dataToDownload,
                          subjects: e.target.checked,
                        })
                      }
                    />
                    Subjects List
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={dataToDownload.electives}
                      onChange={(e) =>
                        setDataToDownload({
                          ...dataToDownload,
                          electives: e.target.checked,
                        })
                      }
                    />
                    Elective Subjects
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={dataToDownload.subjectCOs}
                      onChange={(e) =>
                        setDataToDownload({
                          ...dataToDownload,
                          subjectCOs: e.target.checked,
                        })
                      }
                    />
                    Subject COs
                  </label>
                </div>

                <div className="checkbox-group">
                  <strong>Marks</strong>
                  <label>
                    <input
                      type="checkbox"
                      checked={dataToDownload.testMarks}
                      onChange={(e) =>
                        setDataToDownload({
                          ...dataToDownload,
                          testMarks: e.target.checked,
                        })
                      }
                    />
                    Test Marks (MST1, Viva etc.)
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={dataToDownload.coMarks}
                      onChange={(e) =>
                        setDataToDownload({
                          ...dataToDownload,
                          coMarks: e.target.checked,
                        })
                      }
                    />
                    CO-wise Marks
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={dataToDownload.atktMarks}
                      onChange={(e) =>
                        setDataToDownload({
                          ...dataToDownload,
                          atktMarks: e.target.checked,
                        })
                      }
                    />
                    ATKT Marks
                  </label>
                </div>

                <div className="checkbox-group">
                  <strong>Test Components</strong>
                  {testComponents.map((component) => {
                    const label = component.sub_component_name
                      ? `${component.component_name} (${component.sub_component_name})`
                      : component.component_name;

                    const key = `${component.component_name}::${
                      component.sub_component_name || ""
                    }`;

                    return (
                      <label key={key}>
                        <input
                          type="checkbox"
                          checked={selectedComponents.includes(key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedComponents([
                                ...selectedComponents,
                                key,
                              ]);
                            } else {
                              setSelectedComponents(
                                selectedComponents.filter(
                                  (item) => item !== key
                                )
                              );
                            }
                          }}
                        />
                        {label}
                      </label>
                    );
                  })}
                </div>

                <div className="checkbox-group">
                  <strong>Students</strong>
                  <label>
                    <input
                      type="checkbox"
                      checked={dataToDownload.students}
                      onChange={(e) =>
                        setDataToDownload({
                          ...dataToDownload,
                          students: e.target.checked,
                        })
                      }
                    />
                    Enrolled Students
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={dataToDownload.studentElectives}
                      onChange={(e) =>
                        setDataToDownload({
                          ...dataToDownload,
                          studentElectives: e.target.checked,
                        })
                      }
                    />
                    Student Electives (From Elective Data)
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="upload-button"
                  onClick={async () => {
                    if (
                      !selectedSessionId ||
                      !selectedBranchId ||
                      !selectedCourseId
                    ) {
                      toast.error("Please select session, branch, and course");
                      return;
                    }

                    try {
                      const queryParams = new URLSearchParams({
                        session_id: selectedSessionId,
                        branch_id: selectedBranchId,
                        course_id: selectedCourseId,
                        subjects: dataToDownload.subjects,
                        electives: dataToDownload.electives,
                        subjectCOs: dataToDownload.subjectCOs,
                        testMarks: dataToDownload.testMarks,
                        coMarks: dataToDownload.coMarks,
                        atktMarks: dataToDownload.atktMarks,
                        students: dataToDownload.students,
                        studentElectives: dataToDownload.studentElectives,
                      }).toString();

                      const res = await fetch(
                        `${BACKEND_URL}/api/session/download?${queryParams}`,
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );

                      if (!res.ok) throw new Error("Download failed");

                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "session_data.csv";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      toast.success("Download started");
                      setShowDownloadModal(false);
                    } catch (error) {
                      toast.error("Download failed");
                    }
                  }}
                >
                  Download
                </button>

                <button
                  className="upload-button"
                  onClick={() => setShowDownloadModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionManagement;
