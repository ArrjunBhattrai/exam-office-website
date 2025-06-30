import React, { useState, useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import {logoutUser} from "../../utils/logout"
import { Toaster, toast } from "react-hot-toast";
import { BACKEND_URL } from "../../../config";
import "./admin.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import { fetchLatestSession } from "../../utils/fetchSession"; 

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

const SubjectDataUpload = () => {
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

  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

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

  const handleLogout = () => {
    logoutUser(dispatch);
  };

  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const fetchBranches = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/branch`, {
        method: "GET",
        headers: { authorization: token, "Content-Type": "application/json" },
      });
      const data = await response.json();
      setBranches(data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch branches");
    }
  };
  const fetchCoursesByBranch = async (branchId) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/course/?branch_id=${branchId}`,
        {
          method: "GET",
          headers: { authorization: token, "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      console.log(data);
      setCourses(data.courses || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [token]);

  useEffect(() => {
    if (selectedBranch) {
      fetchCoursesByBranch(selectedBranch);
      setSelectedCourse("");
    }
  }, [selectedBranch]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedCourse || !selectedBranch) {
      toast.error("Please select file, branch and course.");
      return;
    }

    const [course_id, specialization] = selectedCourse.split("___");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("branch_id", selectedBranch);
    formData.append("course_id", course_id);
    formData.append("specialization", specialization);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/subject`,
        {
          method: "POST",
          headers: { authorization: token },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Upload successful!");
        setSelectedBranch("");
        setSelectedCourse("");
        setFile(null);
        setFileInputKey(Date.now());
      } else {
        toast.error(result.error || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  const branchOptions = branches.length
    ? branches.map((branch) => ({
        value: branch.branch_id,
        label: branch.branch_name,
      }))
    : [{ value: "", label: "No branches available" }];
  console.log(branchOptions);

  const courseOptions = courses.length
    ? courses.map((course) => ({
        value: `${course.course_id}___${course.specialization}`,
        label:
          course.specialization.toLowerCase() !== "none"
            ? `${course.course_name} (${course.specialization})`
            : course.course_name,
      }))
    : [{ value: "", label: "No courses available" }];

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
                  <FaHome className="icon" /> Home
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
                  <span className="user-name">[{role || "Please Login"}]</span>
                </p>
              </div>

              <div className="fac-alloc">
                <h3>Upload Subject Data</h3>
                {session ? (
                  <p className="session-text">
                    Current Session: {monthNames[session.start_month]} {session.start_year} -{" "}
                    {monthNames[session.end_month]} {session.end_year}
                  </p>
                ) : (
                  <p className="session-text">{error}</p>
                )}
                <span className="box-overlay-text">Upload</span>

                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>

                  <div className="dropdown">
                    <Dropdown
                      label="Branch"
                      options={branchOptions}
                      selectedValue={selectedBranch}
                      onChange={setSelectedBranch}
                    />
                    <Dropdown
                      label="Course"
                      options={courseOptions}
                      selectedValue={selectedCourse}
                      onChange={setSelectedCourse}
                    />
                  </div>
                  <div>
                    <p>Headers of the file: Subject ID, Subject Name, Sybject Type, Semester</p>
                  </div>

                  <div className="upload-container">
                    <input
                      key={fileInputKey}
                      type="file"
                      accept=".csv"
                      className="file-input"
                      onChange={handleFileChange}
                    />
                    <button
                      className="upload-button"
                      disabled={!selectedCourse || !selectedBranch}
                      onClick={handleUpload}
                    >
                      Upload
                    </button>
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
};

export default SubjectDataUpload;
