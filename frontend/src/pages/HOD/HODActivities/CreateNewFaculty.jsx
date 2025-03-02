import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./HODHome.css";
import Sidebar from "../../../components/Sidebar";
import ActivityHeader from "../../../components/ActivityHeader";
import RedFooter from "../../../components/RedFooter";
import RedHeader from "../../../components/RedHeader";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const CreateNewFaculty = () => {
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    department: "",
    name: "",
    facultyCode: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
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

              <div className="fac-alloc">
                <h3>Create New Faculty</h3>
                <p className="session-text">Current Session: June 2025</p>

                <span className="box-overlay-text">Add Details</span>

                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="input-group">
                      <label>Department:</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>Faculty Code:</label>
                      <input
                        type="text"
                        name="facultyCode"
                        value={formData.facultyCode}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button type="submit" className="submit-btn btn">
                      Submit
                    </button>
                  </form>
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

export default CreateNewFaculty;
