import React, { useState, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux"
import {login } from "../../redux/authSlice"
import { Toaster, toast } from "react-hot-toast";
import { BACKEND_URL } from "../../../config";
import "./admin.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const AdminUpload = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      dispatch(login({
        userId: localStorage.getItem("userId"),
        role: localStorage.getItem("role"),
        token: storedToken
      }));
    }
  }, [dispatch]);

  const { userId, isAuthenticated, role, token } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>;
  } 

  (console.log(useSelector((state) => state.auth)));
  console.log(localStorage.getItem("token"));
  //console.log(role);
  //const authState = useSelector((state) => state.auth);
  //console.log("Auth State in Redux:", authState);
  //console.log("Stored Token:", localStorage.getItem("token"));

    /*
  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>;
  }
    */

  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const [file, setFile] = useState(null);

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
  ? courses.map((course) => ({ value: course.course_id, label: course.course_name }))
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
      console.log(data);
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
  ? branches.map((branch) => ({ value: branch.branch_id, label: branch.branch_name }))
  : [{ value: "", label: "No branches available" }];

  console.log("Courses:", courses);
console.log("Branches:", branches);
console.log("Course Options:", courseOptions);
console.log("Branch Options:", branchOptions);

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
                  { name: "Course Management", path: "/course-management" },
                  { name: "Branch Management", path: "/branch-management" },
                  { name: "Session Management", path: "/session-management" },
                  { name: "Upload Academic Scheme", path: "/admin-upload" },
                  { name: "Upload Student Data", path: "/admin-upload" },
                  { name: "Address Requests", path: "/admin-req" },
                  { name: "Progress Report", path: "/admin-prog-report" },
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
                    {/*
                    <div className="upload-container">
                      <input type="file" accept=".csv" className="file-input" />
                      <button
                        className="upload-button"
                        disabled={!selectedCourse || !selectedBranch}
                      >
                        Upload CSV
                      </button>
                    </div>
                    */}
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

export default AdminUpload;