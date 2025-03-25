import React from "react";
import { useSelector } from "react-redux";
import "./HODHome.css";
import Sidebar from "../../../components/Sidebar";
import ActivityHeader from "../../../components/ActivityHeader";
import RedFooter from "../../../components/RedFooter";
import RedHeader from "../../../components/RedHeader";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const HODHome = () => {
  const user = useSelector((state) => state.auth.user); // Get logged-in user
  //   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="hod-home-container">
      <div className="hod-bg">
        <RedHeader />
        <div className="hod-content">
          <ActivityHeader />

          <div className="hod-main">
            <div className="sidebars">
              <Sidebar
                className="sidebar-0"
                title="Branch Managment "
                activities={[
                  { name: "Manage Branch", path: "/branch-management" },
                  { name: "Create course", path: "/hod-new-fac" },
                  { name: "Upload Data for Electives", path: "/hod-upload" },
                  {
                    name: "View Correction Requests",
                    path: "/hod-correction-req",
                  },
                  {
                    name: "View Department Details",
                    path: "/hod-deptt-details",
                  },
                ]}
              />
              <Sidebar
                className="sidebar-1"
                title="HOD Activity"
                activities={[
                  { name: "Faculty Allocation", path: "/hod-fac-alloc" },
                  { name: "Create New Faculty", path: "/hod-new-fac" },
                  { name: "Upload Data for Electives", path: "/hod-upload" },
                  {
                    name: "View Correction Requests",
                    path: "/hod-correction-req",
                  },
                  {
                    name: "View Department Details",
                    path: "/hod-deptt-details",
                  },
                ]}
              />

              <Sidebar
                className="sidebar-2"
                title="Form Dashboard"
                activities={[
                  { name: "View Saved Form", path: "/saved-form" },
                  { name: "View Filled Form", path: "/filled-form" },
                  { name: "Delete Filled Form", path: "/delete-form" },
                  { name: "Progress Report", path: "/progress-report" },
                ]}
              />
            </div>

            <div className="hod-info">
              <div className="hod-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/hod-home")}
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
                  <span className="hod-name">{user?.name || "HOD IT"}</span>
                </p>
                <p>
                  <span className="hod-role">Role: </span>
                  <span className="hod-name">[{user?.role || "HOD"}]</span>
                </p>
                <p>
                  <span className="hod-role">Department: </span>
                  <span className="hod-name">
                    [
                    {user?.department || "Department of Information Technology"}
                    ]
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

export default HODHome;
