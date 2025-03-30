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
                title="HOD Activities"
                activities={[
                  { name: "View Department Details", path: "/hod-deptt-details" },
                  { name: "Faculty Allocation", path: "/hod-fac-alloc" },
                  { name: "Progress Report", path: "/" },
                  {name: "View Correction Requests", path: "/hod-correction-req" },
                  
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
