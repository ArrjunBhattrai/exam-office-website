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
import { Outlet } from "react-router-dom";
import BranchManagement from "./BranchManagment";
import CourseManagement from "../../../components/Course/Course";

const AdminHome = () => {
  const {
    officer_id,
    isAuthenticated,
    officer_name,
    user_type,
    email,
    department_id,
    token,
  } = useSelector((state) => state.auth);
  // const []
  // console.log("============", user);
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>;
  }
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
                title="Admin Activity"
                activities={[
                  { name: "Upload Academic Scheme", path: "/admin-upload" },
                  { name: "Course Related Activities", path: "/course-management" },
                  { name: "Branch Related Activities", path: "/branch-management" },
                  { name: "Progress Report", path: "/admin/prog-report" },
                  { name: "Address Requests", path: "/admin-req" },
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
                <p>
                  <span className="hod-role">Department: </span>
                  <span className="hod-name">
                    [{department_id || "Please Login"}]
                  </span>
                </p>
              </div>
              <BranchManagement />
              <CourseManagement />
            </div>
          </div>
          <RedFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
