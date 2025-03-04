import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./HODHome.css";
import Sidebar from "../../../components/Sidebar";
import ActivityHeader from "../../../components/ActivityHeader";
import RedFooter from "../../../components/RedFooter";
import RedHeader from "../../../components/RedHeader";
import Dropdown from "../../../components/Dropdown";
import Button from "../../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const FacultyAllocation = () => {
  const user = useSelector((state) => state.auth.user);

  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

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
                <h3>Faculty Allocation</h3>
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
                      options={branches.map((b) => b.branch_name)} // Use fetched branches
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

export default FacultyAllocation;
