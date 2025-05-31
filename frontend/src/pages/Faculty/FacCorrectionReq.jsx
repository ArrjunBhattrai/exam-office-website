import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import "./HODHome.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const FacCorrectionReq = () => {
  const user = useSelector((state) => state.auth.user);

  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");

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
                    name: "ATKT Marks Feeding",
                    path: "/faculty/atkt-marks-feed",
                  },
                  {
                    name: "Make Correction Request",
                    path: "/faculty/correction-request",
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
                  <span className="user-name">
                    [{user?.name || "Please Login"}]
                  </span>
                </p>
                <p>
                  <span className="user-role">Role: </span>
                  <span className="user-name">
                    [{user?.role || "Please Login"}]
                  </span>
                </p>
                <p>
                  <span className="user-role">Department: </span>
                  <span className="user-name">
                    [{user?.department || "Please Login"}]
                  </span>
                </p>
              </div>

              <div>
                {/* here */}
                <div className="fac-alloc">
                  <h3>Correction Request</h3>
                  <p className="session-text">Current Session: June 2025</p>

                  <span className="box-overlay-text">Draft a request</span>

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
                      navigateTo="/" //--> to set path
                    />
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

export default FacCorrectionReq;
