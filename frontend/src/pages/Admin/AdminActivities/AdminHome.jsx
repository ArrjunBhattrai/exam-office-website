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

const AdminHome = () => {
  const { officer_id, officer_name, user_type, email, department_id, token } =
    useSelector((state) => state.auth);
  // console.log("============", user);
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
                title="Faculty Activity"
                activities={[
                  { name: "Upload Marking Scheme", path: "/admin-upload" },
                  { name: "Create New Subject", path: "/admin-new-sub" },
                  {
                    name: "Update Existing Subject",
                    path: "/admin-update-sub",
                  },
                  {
                    name: "Delete Existing Subject",
                    path: "/admin-delete-sub",
                  },
                  { name: "Address Requests", path: "/admin-req" },
                ]}
              />

              <Sidebar
                className="sidebar-2"
                title="Form Dashboard"
                activities={[
                  { name: "View Saved Form", path: "/admin-saved-form" },
                  { name: "View Filled Form", path: "/admin-filled-form" },
                  { name: "Delete Filled Form", path: "/admin-delete-form" },
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
                <p>
                  <span className="hod-role">Department: </span>
                  <span className="hod-name">
                    [{department_id || "Please Login"}]
                  </span>
                </p>
              </div>
            </div>
          </div>

          <RedFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
