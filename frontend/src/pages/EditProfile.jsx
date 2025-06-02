import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../config";
import { useSelector } from "react-redux";
import RedHeader from "../components/RedHeader";
import RedFooter from "../components/RedFooter";
import ActivityHeader from "../components/ActivityHeader";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import Button from "../components/Button";

const EditProfile = () => {
  const { userId, isAuthenticated, role, token } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role != "admin") {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = async() => {
    if (!password) return toast.error("Enter your current password to continue.");

    try {
        const res = await fetch()
    }
  }

  return (
    <div className="home-container">
      <div className="user-bg">
        <RedHeader />
        <div className="user-content">
          <ActivityHeader />
          <div className="user-main">
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
                  <span className="user-name">{userId && `[${userId}]`}</span>
                </p>
                <p>
                  <span className="user-role">Role: </span>
                  <span className="user-name">[{role && `${role}`}]</span>
                </p>
              </div>
              <div className="fac-alloc">
                <h3>EDIT USER INFORMATION</h3>
                <br />
                <span className="box-overlay-text">Update Information</span>
                <div className="faculty-box">
                  <div className="edit-profile-input">
                    <label>Old Password:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div className="edit-profile-input">
                    <label>New Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter new email"
                    />
                  </div>

                  <div className="edit-profile-input">
                    <label>New Password (optional):</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>

                  <Button
                  text="Update" 
                  />

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

export default EditProfile;
