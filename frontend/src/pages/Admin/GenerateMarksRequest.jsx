import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../utils/logout";
import "./admin.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import { fetchLatestSession } from "../../utils/fetchSession";
import { Toaster, toast } from "react-hot-toast";

const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const componentMap = {
  Elective: ["CW", "Theory"],
  Theory: ["CW", "Theory"],
  Practical: ["SW", "Practical"],
};

const subComponentMap = {
  CW: ["MST 1", "MST 2", "Assignment 1", "Assignment 2"],
  Theory: ["Theory Exam"],
  SW: ["Viva 1", "Viva 2"],
  Practical: ["External Viva", "External Submission"],
};

function GenerateMarksRequest() {
  const { userId, isAuthenticated, role, token } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role !== "admin") {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }

  const dispatch = useDispatch();
  const handleLogout = () => logoutUser(dispatch);

  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await fetchLatestSession(token);
        setSession(data);
      } catch (err) {
        setError("No current session found");
        setSession(null);
      }
    };
    loadSession();
  }, [token]);

  // form state
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const branchOptions = branches.map((b) => ({
    value: b.branch_id,
    label: b.branch_name,
  }));

  const courseOptions = courses.map((c) => ({
    value: c.course_id,
    label: c.course_name,
  }));

  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectType, setSubjectType] = useState("");
  const [component, setComponent] = useState("");
  const [subComponent, setSubComponent] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [requests, setRequests] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // ✅ Fetch All Branches
  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/branch", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBranches(data.branches || data || []);
    } catch (err) {
      toast.error("Failed to fetch branches");
    }
  };

  // ✅ Fetch Courses for Selected Branch
  const fetchCoursesByBranch = async (branchId) => {
    try {
      const res = await fetch(`/api/course?branch_id=${branchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      toast.error("Failed to fetch courses");
    }
  };

  // ✅ Fetch on Load
  useEffect(() => {
    if (token) fetchBranches();
  }, [token]);

  // ✅ Fetch courses whenever branch changes
  useEffect(() => {
    if (selectedBranch) {
      fetchCoursesByBranch(selectedBranch);
      setSelectedCourse("");
    } else {
      setCourses([]);
    }
  }, [selectedBranch]);

  // Fetch subjects by branch (your existing route: /admin/get-subjects/:branch_id)
  const fetchSubjects = async (branch_id) => {
    if (!branch_id) {
      setSubjects([]);
      return;
    }
    try {
      const res = await fetch(`/admin/get-subjects/${branch_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Error fetching subjects:", res.status, data);
        setSubjects([]);
        return;
      }
      setSubjects(data.subjects || data || []);
    } catch (err) {
      console.error("Fetch subjects error:", err);
      setSubjects([]);
    }
  };

  // Fetch all marks fill requests (route: /admin/get-marks-fill-req)
  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await fetch("/admin/get-marks-fill-req", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Error fetching requests:", res.status, data);
        toast.error(data.message || "Failed to load requests");
        setRequests([]);
        return;
      }
      setRequests(data.requests || data || []);
    } catch (err) {
      console.error("Fetch requests error:", err);
      toast.error("Failed to fetch requests");
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };


  useEffect(() => {
  if (selectedBranch) {
    fetchSubjects(selectedBranch);
    setSelectedCourse("");
    setSubjectId("");
  } else {
    setSubjects([]);
  }
}, [selectedBranch]);


  useEffect(() => {
    setComponent("");
    setSubComponent("");
  }, [subjectType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      toast.error("Session not found");
      return;
    }

    if (
      !branchId ||
      !courseId ||
      !subjectId ||
      !subjectType ||
      !component ||
      !subComponent ||
      !dueDate
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      session_id: session.session_id,
      branch_id: branchId,
      course_id: courseId,
      subject_id: subjectId,
      subject_type: subjectType,
      component_name: component,
      sub_component_name: subComponent,
      last_date: dueDate,
    };

    try {
      const res = await fetch("/admin/generate-marks-fill-req", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Request generated successfully ✅");
        setSubjectType("");
        setComponent("");
        setSubComponent("");
        setDueDate("");
        fetchRequests();
      } else {
        console.error("Create request failed:", res.status, data);
        toast.error(data.message || "Failed to create request ❌");
      }
    } catch (err) {
      console.error("Create request error:", err);
      toast.error("Server error while creating request");
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
                className="sidebar"
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
                  { name: "Generate Marks Request", path: "/admin/marks-req" },
                ]}
              />
            </div>

            <div className="user-info">
              <div className="user-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/admin/home")}
                >
                  <FaHome className="icon" /> Home
                </button>

                <button
                  className="icon-btn"
                  onClick={() =>
                    (window.location.href = "/edit-user-information")
                  }
                >
                  <FaPen className="icon" /> Edit Info
                </button>

                <button className="icon-btn" onClick={handleLogout}>
                  <FaSignOutAlt className="icon" /> Logout
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
                {session ? (
                  <p className="session-text">
                    Current Session: {monthNames[session.start_month]}{" "}
                    {session.start_year} - {monthNames[session.end_month]}{" "}
                    {session.end_year}
                  </p>
                ) : (
                  <p className="session-text">{error}</p>
                )}
                <span className="box-overlay-text">Marks Fill Request</span>

                <div className="faculty-box">
                  <div className="space-y-6">
                    <Toaster position="top-right" />
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4 p-4 bg-white rounded-lg shadow"
                    >
                      <Dropdown
                        label="Branch"
                        options={branchOptions}
                        selectedValue={selectedBranch}
                        onChange={(value) => setSelectedBranch(value)}
                      />

                      <Dropdown
                        label="Course"
                        options={courseOptions}
                        selectedValue={selectedCourse}
                        onChange={(value) => setSelectedCourse(value)}
                      />

                      <Dropdown
                        label="Subject"
                        options={subjects.map((s) => ({
                          value: s.subject_id || s.id || s._id,
                          label: s.subject_name || s.name,
                        }))}
                        selectedValue={subjectId}
                        onChange={(value) => {
                          setSubjectId(value);
                        }}
                      />

                      <Dropdown
                        label="Subject Type"
                        options={[
                          { value: "Theory", label: "Theory" },
                          { value: "Elective", label: "Elective" },
                          { value: "Practical", label: "Practical" },
                        ]}
                        selectedValue={subjectType}
                        onChange={setSubjectType}
                      />

                      {subjectType && (
                        <Dropdown
                          label="Component"
                          options={(componentMap[subjectType] || []).map(
                            (comp) => ({ value: comp, label: comp })
                          )}
                          selectedValue={component}
                          onChange={setComponent}
                        />
                      )}

                      {component && (
                        <Dropdown
                          label="Sub-Component"
                          options={(subComponentMap[component] || []).map(
                            (sub) => ({ value: sub, label: sub })
                          )}
                          selectedValue={subComponent}
                          onChange={setSubComponent}
                        />
                      )}

                      <div className="due-date">
                        <label>Due Date:</label>
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="input-fac w-full px-3 py-2 border rounded-lg"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                      >
                        Add Request
                      </button>
                    </form>
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <h3 style={{ marginBottom: 8 }}>Existing Requests</h3>
                    {loadingRequests ? (
                      <p>Loading requests...</p>
                    ) : (
                      <table className="request-table">
                        <thead>
                          <tr>
                            <th>Request ID</th>
                            <th>Generated On</th>
                            <th>Subject</th>
                            <th>Component</th>
                            <th>Sub-component</th>
                            <th>Due Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.length === 0 && (
                            <tr>
                              <td
                                colSpan={7}
                                style={{ textAlign: "center", padding: 12 }}
                              >
                                No requests found
                              </td>
                            </tr>
                          )}
                          {requests.map((req) => {
                            const lastDate =
                              req.last_date || req.due_date || req.lastDate;
                            const assignedOn =
                              req.assigned_date ||
                              req.created_at ||
                              req.request_date;
                            const subjectLabel =
                              req.subject_name ||
                              req.subject?.subject_name ||
                              req.subject?.name ||
                              req.assessment?.name ||
                              "N/A";
                            const statusFromBackend = (req.status || "")
                              .toString()
                              .toLowerCase();
                            const computedStatus =
                              statusFromBackend === "pending" ||
                              statusFromBackend === "not_submitted"
                                ? new Date(lastDate) > new Date()
                                  ? "Not Submitted"
                                  : "Due"
                                : statusFromBackend === "submitted"
                                ? "Submitted"
                                : statusFromBackend === "due"
                                ? "Due"
                                : new Date(lastDate) > new Date()
                                ? "Not Submitted"
                                : "Due";

                            return (
                              <tr key={req.request_id || req.id || assignedOn}>
                                <td>{req.request_id || req.id || ""}</td>
                                <td>
                                  {assignedOn
                                    ? new Date(assignedOn).toLocaleDateString()
                                    : "—"}
                                </td>
                                <td>{subjectLabel}</td>
                                <td>
                                  {req.component_name ||
                                    req.component ||
                                    component}
                                </td>
                                <td>
                                  {req.sub_component_name ||
                                    req.sub_component ||
                                    subComponent}
                                </td>
                                <td>
                                  {lastDate
                                    ? new Date(lastDate).toLocaleDateString()
                                    : "—"}
                                </td>
                                <td>{computedStatus}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RedFooter />
        </div>
      </div>
    </div>
  );
}

export default GenerateMarksRequest;
