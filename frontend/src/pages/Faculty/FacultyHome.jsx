import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./faculty.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const FacultyHome = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="home-container">
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
                  { name: "View Assigned Subjects", path: "/fac-view-sub" },
                  { name: "Marks Feeding Activities", path: "/fac-marks-feed" },
                  { name: "Make Correction Request", path: "/fac-correction-req" },
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
                    [{user?.name || "Please Login"}]
                  </span>
                </p>
                <p>
                  <span className="hod-role">Role: </span>
                  <span className="hod-name">
                    [{user?.role || "Please Login"}]
                  </span>
                </p>
                <p>
                  <span className="hod-role">Department: </span>
                  <span className="hod-name">
                    [{user?.department || "Please Login"}]
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

export default FacultyHome;
