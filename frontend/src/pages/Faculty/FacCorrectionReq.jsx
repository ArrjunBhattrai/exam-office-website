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
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import { BACKEND_URL } from "../../../config";

const FacCorrectionReq = () => {
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
  const currentSession = useSelector((state) => state.session.currentSession);

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [component, setComponent] = useState("");
  const [subComponent, setSubComponent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const subjectOptions = assignedSubjects.length
    ? assignedSubjects.map((subject) => ({
        value: JSON.stringify({
          subject_id: subject.subject_id,
          subject_type: subject.subject_type,
          subject_name: subject.subject_name,
        }),
        label: `${subject.subject_name} - ${subject.subject_type}`,
      }))
    : [{ value: "", label: "No subjects assigned" }];

  const componentMap = {
    Theory: ["CW", "Theory"],
    Practical: ["SW", "Practical"],
  };

  const subComponentMap = {
    CW: ["MST 1", "MST 2", "Assignment 1", "Assignment 2"],
    Theory: ["Theory Exam"],
    SW: ["Viva 1", "Viva 2"],
    Practical: ["External Viva", "External Submission"],
  };

  const componentOptions = selectedSubject?.subject_type
    ? componentMap[selectedSubject.subject_type] || []
    : [];

  const subComponentOptions = component ? subComponentMap[component] || [] : [];

  const fetchAssignedSubjects = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/faculty/assignedSubjects/${userId}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assigned Subjects");
      }

      const data = await response.json();
      setAssignedSubjects(data.subjects);
    } catch (error) {
      toast.error(error.message || "Failed to fetch Assigned Subjects");
    }
  };
  useEffect(() => {
    fetchAssignedSubjects();
  }, [token]);

  const handleProceed = async () => {
    if (selectedSubject.subject_id && component && subComponent) {
      setShowOptions(true);
    } else {
      toast.error("Please select all fields");
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
                    name: "ATKT Marks Feeding",
                    path: "/faculty/atkt-marks-feed",
                  },

                  {
                    name: "Make Correction Request",
                    path: "/faculty/correction-request",
                  },
                  {
                    name: "Edit Personal Info",
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
                  onClick={() =>
                    (window.location.href = "/edit-user-information")
                  }
                >
                  <FaPen className="icon" />
                  Edit Info
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
                  <h3>Correction Request</h3>
                  <p className="session-text">
                    Current Session:{" "}
                    {currentSession
                      ? `${currentSession.start_month}/${currentSession.start_year} - ${currentSession.end_month}/${currentSession.end_year}`
                      : "Loading..."}
                  </p>

                  <span className="box-overlay-text">Draft a request</span>

                  <div className="faculty-box">
                    {/* <p className="institute-text">
                      <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                      TECHNOLOGY & SCIENCE
                    </p> */}

                    <div className="dropdown-container">
                      <Dropdown
                        label="Subject"
                        options={subjectOptions}
                        selectedValue={JSON.stringify(selectedSubject)}
                        onChange={(value) => {
                          const parsedValue = JSON.parse(value);
                          setSelectedSubject(parsedValue);
                          setComponent("");
                          setSubComponent("");
                        }}
                      />

                      <Dropdown
                        label="Component"
                        options={componentOptions.map((comp) => ({
                          value: comp,
                          label: comp,
                        }))}
                        selectedValue={component}
                        onChange={(value) => {
                          setComponent(value);
                          setSubComponent("");
                        }}
                      />

                      <Dropdown
                        label="Sub Component"
                        options={subComponentOptions.map((sub) => ({
                          value: sub,
                          label: sub,
                        }))}
                        selectedValue={subComponent}
                        onChange={setSubComponent}
                      />
                    </div>

                    {!showOptions ? (
                      <Button text="Proceed" onClick={handleProceed} />
                    ) : (
                      <div className="req-options">
                        <Button
                          text="See Past Requests"
                          //   onClick={async () => {

                          // }}
                        />

                        <Button
                          text="Draft New Request"
                          // onClick={async () => {

                          // }}
                        />

                        <Button
                          text="Withdraw Waiting Requests"
                          // onClick={async () => {

                          // }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content"></div>
            </div>
          )}

          <RedFooter />
        </div>
      </div>
    </div>
  );
};

export default FacCorrectionReq;
