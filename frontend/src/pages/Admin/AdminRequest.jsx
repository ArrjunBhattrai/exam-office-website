import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./admin.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";

const AdminRequest = () => {
    const { userId, isAuthenticated, role, token } = useSelector(
            (state) => state.auth
          );
      
          if (!isAuthenticated || role != "admin") {
            return <div>Please log in to access this page.</div>;
          } 

          const [courses, setCourses] = useState([]);
            const [branches, setBranches] = useState([]);

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
                  { name: "Progress Report", path: "/admin/progress-report" },
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
                  <span className="user-name">
                    {userId && `[${userId}]`}
                  </span>
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
                <h3>Correction Request</h3>
                <p className="session-text">Current Session: June 2025</p>

                <span className="box-overlay-text">View request</span>

                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>
                <div className="dropdown">
                {/* <Dropdown
                      label="Course"
                      options={courses.map((c) => c.course_name)}
                      selectedValue={selectedCourse}
                      onChange={setSelectedCourse}
                    />
                    <Dropdown
                      label="Branch"
                      options={branches.map((b) => b.branch_name)}
                      selectedValue={selectedBranch}
                      onChange={setSelectedBranch}
                      disabled={!selectedCourse}
                    /> */}
                  </div>
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

export default AdminRequest;