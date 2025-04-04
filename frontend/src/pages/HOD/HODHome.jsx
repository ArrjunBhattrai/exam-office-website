import React from "react";
import { useSelector } from "react-redux";
import "./HOD.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const HODHome = () => {
  const user = useSelector((state) => state.auth.user); // Get logged-in user

  return (
    <div className="home-container">
      <div className="user-bg">
        <RedHeader />
        <div className="user-content">
          <ActivityHeader />

          <div className="user-main">
            <div className="sidebars">
              <Sidebar
                className="sidebar-0"
                title="HOD Activities"
                activities={[
                  { name: "View Department Details", path: "/hod-dept-details" },
                  { name: "Faculty Allocation", path: "/hod-fac-alloc" },
                  { name: "Progress Report", path: "/" },
                  {name: "View Correction Requests", path: "/hod-correction-req" },
                  
                ]}
              />
          
            </div>

            <div className="user-info">
              <div className="user-icons">
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
              <div className="user-sec">
                <p>
                  <span>Welcome: </span>
                  <span className="user-name">{user?.name || "HOD IT"}</span>
                </p>
                <p>
                  <span className="user-role">Role: </span>
                  <span className="user-name">[{user?.role || "HOD"}]</span>
                </p>
                <p>
                  <span className="user-role">Department: </span>
                  <span className="user-name">
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
