import React from "react";
import { useSelector } from "react-redux";
import "./admin.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const AdminHome = () => {
  const { userId, isAuthenticated, role, token } = useSelector(
    (state) => state.auth
  );
  
  
  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>;
  } 

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
                  <span className="user-name">
                    {userId && `[${userId}]`}
                  </span>
                </p>
                <p>
                  <span className="user-role">Role: </span>
                  <span className="user-name">
                    [{(role && `${role}`)}]
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