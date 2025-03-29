import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
// import "./HODHome.css";
import Sidebar from "../../../components/Sidebar";
import ActivityHeader from "../../../components/ActivityHeader";
import RedFooter from "../../../components/RedFooter";
import RedHeader from "../../../components/RedHeader";
import Dropdown from "../../../components/Dropdown";
import Button from "../../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const AdminProgressReport = () => {
      const { officer_name, user_type, token } = useSelector((state) => state.auth);
  

  return (
    <div className="hod-home-container">
      <div className="hod-bg">
        <RedHeader />
        <div className="hod-content">
          <ActivityHeader />

          <div className="hod-main">
            <div className="sidebars">
              <Sidebar
                className="sidebar-1"
                title="Form Dashboard"
                activities={[
                  { name: "Course Management", path: "/course-management" },
                    { name: "Branch Management", path: "/branch-management" },
                    { name: "Session Management", path: "/session-management" },
                    { name: "Upload Marking Scheme", path: "/admin-upload" },
                    { name: "Faculty Management", path: "/faculty-management" },
                    { name: "Assign HOD", path: "/assign-hod" },
                    { name: "Upload Student Data", path: "/admin-upload" },
                    { name: "Address Requests", path: "/admin-req" },
                    { name: "Progress Report", path: "/admin-prog-report" },
                  
              ]}
              />
            </div>

            <div className="hod-info">
              <div className="hod-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/fac-home")}
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
              <div className="hod-sec">
              <p>
                  <span>Welcome: </span>
                  <span className="hod-name">
                    {officer_name && `[${officer_name}]`}
                  </span>
                </p>
                <p>
                  <span className="hod-role">Role: </span>
                  <span className="hod-name">
                    [{(user_type && `${user_type}`) || "Please Login"}]
                  </span>
                </p>
              </div>

              <div>
                 {/* here */}
                 <div className="fac-alloc">
                <h3>Progress Report</h3>
                <p className="session-text">Current Session: June 2025</p>

                <span className="box-overlay-text">Select to view</span>

                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>

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

export default AdminProgressReport;
