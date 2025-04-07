import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { BACKEND_URL } from "../../../config";
import "./admin.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const AcademicSchemeUpload = () => {
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

  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  // fetch courses
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/courses`, {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const courseOptions = courses.length
    ? courses.map((course) => ({
        value: course.course_id,
        label: course.course_name,
      }))
    : [{ value: "", label: "No courses available" }];

  //fetch course of the selected branch
  const fetchBranchesByCourse = async () => {
    console.log(token);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/admin/branches/byCourse?course=${selectedCourse}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch branches");
      }

      const data = await response.json();
      setBranches(data.branches);
    } catch (error) {
      toast.error(error.message || "Failed to fetch branches");
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      fetchBranchesByCourse();
    }
  }, [token, selectedCourse]);

  const branchOptions = branches.length
    ? branches.map((branch) => ({
        value: branch.branch_id,
        label: branch.branch_name,
      }))
    : [{ value: "", label: "No branches available" }];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("branch_id", selectedBranch);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/admin/upload/academic-scheme`,
        {
          method: "POST",
          headers: {
            authorization: token,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Upload successful!");
        setSelectedCourse("");
        setSelectedBranch("");
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
                  { name: "Course Management", path: "/admin/course-management" },
                  { name: "Branch Management", path: "/admin/branch-management" },
                  { name: "Session Management", path: "/admin/session-management" },
                  { name: "Upload Academic Scheme", path: "/admin/academic-scheme-upload" },
                  { name: "Upload Student Data", path: "/admin/student-data-upload" },
                  { name: "Address Requests", path: "/admin/req" },
                  { name: "Progress Report", path: "/admin/prog-report" },
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

              <div>
                {/* here */}
                <div className="fac-alloc">
                  <h3>Upload Academic Scheme</h3>
                  <p className="session-text">Current Session: June 2025</p>

                  <span className="box-overlay-text">Upload</span>

                  <div className="faculty-box">
                    <p className="institute-text">
                      <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                      TECHNOLOGY & SCIENCE
                    </p>

                    <div className="dropdown">
                      <Dropdown
                        label="Course"
                        options={courseOptions}
                        selectedValue={selectedCourse}
                        onChange={setSelectedCourse}
                      />
                      <Dropdown
                        label="Branch"
                        options={branchOptions}
                        selectedValue={selectedBranch}
                        onChange={setSelectedBranch}
                      />
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
          </div>

          <RedFooter />
        </div>
      </div>
    </div>
  );
};

export default AcademicSchemeUpload;
