import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import "./faculty.css";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { BACKEND_URL } from "../../../config";

const FacEditInfo = () => {
  const { userId, isAuthenticated, role, token } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role !== "faculty") {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`$BACKEND_URL/faculty/___`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          currentPassword,
          newEmail,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update information");
      }

      toast.success("Information updated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="user-bg">
        <RedHeader />
        <div className="user-content">
          <ActivityHeader />

          <div className="user-main">
            <div className="sidebars">
              <Sidebar
                className="sidebar-1"
                title="Faculty Activity"
                activities={[
                  {
                    name: "View Assigned Subjects",
                    path: "/faculty/view-subjects",
                  },
                  {
                    name: "Marks Feeding Activities",
                    path: "/faculty/marks-feed",
                  },
                  {
                    name: "Make Correction Request",
                    path: "/faculty/correction-request",
                  },
                  {
                    name: "Edit Login Info",
                    path: "/faculty/edit-info",
                  },
                ]}
              />
            </div>

            <div className="user-info">
              <div className="user-icons">
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
              <div className="user-sec">
                <p>
                  <span>Welcome: </span>
                  <span className="user-name">{userId && `[${userId}]`}</span>
                </p>
                <p>
                  <span className="user-role">Role: </span>
                  <span className="user-name">[{role && `${role}`}]</span>
                </p>
              </div>

              <div>
                {/* here */}
                <div className="fac-alloc">
                  <h3>Edit Login Information</h3>
                  <p className="session-text">Current Session: June 2025</p>

                  <span className="box-overlay-text">Edit info</span>

                  <div className="faculty-box">
                    {/* <p className="institute-text">
                      <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                      TECHNOLOGY & SCIENCE
                    </p> */}

                    <div className="edit-info-form">
                      <div className="entries">
                        <label>Current Password:</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>

                      <div className="entries">
                        <label>New Email ID:</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter new email (optional)"
                        />
                      </div>

                      <div className="entries">
                        <label>New Password:</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (optional)"
                        />
                      </div>
                    
                    <div className="btn-container">
                        <Button
                        text={loading ? "Updating..." : "Update Info"}
                        onClick={handleUpdate}
                        disabled={loading}
                      />
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
    </div>
  );
};

export default FacEditInfo;
