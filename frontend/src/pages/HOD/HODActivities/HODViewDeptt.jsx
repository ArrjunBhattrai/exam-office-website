import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./HODHome.css";
import Sidebar from "../../../components/Sidebar";
import ActivityHeader from "../../../components/ActivityHeader";
import RedFooter from "../../../components/RedFooter";
import RedHeader from "../../../components/RedHeader";
import Dropdown from "../../../components/Dropdown";
import Button from "../../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const HODViewDeptt = () => {
  const user = useSelector((state) => state.auth.user); // Get logged-in user
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");

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
                  {
                    name: "View Department Details",
                    path: "/hod-deptt-details",
                  },
                  { name: "Create New Faculty", path: "/hod-new-fac" },
                  { name: "Faculty Allocation", path: "/hod-fac-alloc" },
                  { name: "Upload Data for Electives", path: "/hod-upload" },
                  { name: "Progress Report", path: "/progress-report" },
                  {
                    name: "View Correction Requests",
                    path: "/hod-correction-req",
                  }, 
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
                <h3>Department Details</h3>
                <p className="session-text">Current Session: June 2025</p>

                <span className="box-overlay-text">
                  Select Option To View Details
                </span>

                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>

                  <div className="dropdown-container">
                    <Dropdown
                      label="Course"
                      options={["BE", "ME", "B.Pharma"]}
                      selectedValue={course}
                      onChange={setCourse}
                    />

                    <Dropdown
                      label="Branch"
                      options={["CSE", "IT", "ECE", "EI"]}
                      selectedValue={branch}
                      onChange={setBranch}
                    />

                    <Dropdown
                      label="Semester"
                      options={[
                        "I",
                        "II",
                        "III",
                        "IV",
                        "V",
                        "VI",
                        "VII",
                        "VIII",
                      ]}
                      selectedValue={semester}
                      onChange={setSemester}
                    />
                  </div>
                  <Button
                    className="btn"
                    text="Show"
                    navigateTo="/hod-fac-alloc-table"
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

export default HODViewDeptt;
