import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
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

  const allowedRoles = ["admin", "hod", "faculty"];

  if (!isAuthenticated || !allowedRoles.includes(role)) {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }

  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = async () => {
    // e.preventDefault();

    if (!oldPassword)
      return toast.error("Enter your current password to continue.");

    if (!newEmail && !newPassword) {
      toast.warn("Nothing to update. Enter new email or password.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/user/info-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          userId,
          role,
          oldPassword,
          newEmail,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update profile.");
      } else {
        toast.success(data.message || "Profile updated successfully.");
        setOldPassword("");
        setNewEmail("");
        setNewPassword("");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("An unexpected error occurred.");
    }
  };

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
                  onClick={() => {
                    const pathMap = {
                      admin: "/admin/home",
                      hod: "/hod/home",
                      faculty: "/faculty/home",
                    };
                    window.location.href = pathMap[role] || "/";
                  }}
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
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div className="edit-profile-input">
                    <label>New Email:</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
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

                  <Button text="Update" onClick={handleUpdate} />
                </div>
              </div>
            </div>
          </div>
          <RedFooter />
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        //   theme="colored"
      />
    </div>
  );
};

export default EditProfile;
