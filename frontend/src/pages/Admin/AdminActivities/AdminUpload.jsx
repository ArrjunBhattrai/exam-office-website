import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./admin.css";
import Sidebar from "../../../components/Sidebar";
import ActivityHeader from "../../../components/ActivityHeader";
import RedFooter from "../../../components/RedFooter";
import RedHeader from "../../../components/RedHeader";
import Dropdown from "../../../components/Dropdown";
import Button from "../../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const AdminUpload = () => {
  const user = useSelector((state) => state.auth.user);

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid CSV file.");
      setFile(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("No file selected!");
      return;
    }
    console.log("Uploading:", file.name);

    /* further processing logic here */
  };

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

              <div>
                {/* here */}
                <div className="fac-alloc">
                  <h3>Upload Marking Scheme</h3>
                  <p className="session-text">Current Session: June 2025</p>

                  <span className="box-overlay-text">Upload</span>

                  <div className="faculty-box">
                    <p className="institute-text">
                      <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                      TECHNOLOGY & SCIENCE
                    </p>
                    <div className="upload-container">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      <button onClick={handleUpload} className="upload-button">
                        Upload CSV
                      </button>
                      {file && <p>Selected File: {file.name}</p>}
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

export default AdminUpload;
