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

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [component, setComponent] = useState("");
  const [subComponent, setSubComponent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [reason, setReason] = useState("");
  const [pastRequests, setPastRequests] = useState([]);
const [showPastRequests, setShowPastRequests] = useState(false);


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
        `${BACKEND_URL}/api/subject/faculty-subjects/${userId}`,
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
      try {
        const query = new URLSearchParams({
          subject_id: selectedSubject.subject_id,
          subject_type: selectedSubject.subject_type,
          component_name: component,
          sub_component_name: subComponent,
        }).toString();

        const res = await fetch(
          `${BACKEND_URL}/api/req/submitted-form?${query}`,
          {
            method: "GET",
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (!res.ok || !data.submitted) {
          toast.error("No submitted marks found for the selected inputs.");
          return;
        }

        setShowOptions(true);
      } catch (err) {
        toast.error("Error checking for submitted forms.");
        console.error(err);
      }
    } else {
      toast.error("Please select all fields");
    }
  };

  const handleSubmitRequest = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/req/submit-request`, {
        method: "POST",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject_id: selectedSubject.subject_id,
          subject_type: selectedSubject.subject_type,
          component_name: component,
          sub_component_name: subComponent,
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to submit request");
        return;
      }

      toast.success("Request submitted successfully");
      setReason("");
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to submit request");
      console.error(err);
    }
  };

  const handleFetchPastRequests = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/req/past-requests/${userId}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to fetch past requests");
        return;
      }

      setPastRequests(data.requests || []);
      setShowPastRequests(true);
    } catch (err) {
      toast.error("Failed to load past requests");
      console.error(err);
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
                  <p className="session-text">Current Session: June 2025</p>

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
                          onClick={handleFetchPastRequests}
                        />

                        <Button
                          text="Draft New Request"
                          onClick={() => setShowModal(true)}
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
              <div className="modal-content">
                <h2>Submit Correction Request</h2>
                <textarea
                  rows="4"
                  placeholder="State the reason for your correction request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
                <div className="modal-actions">
                  <Button text="Submit Request" onClick={handleSubmitRequest} />
                  <Button text="Cancel" onClick={() => setShowModal(false)} />
                </div>
              </div>
            </div>
          )}

          {showPastRequests && (
            <div className="past-requests-section">
              <h3>Past Correction Requests</h3>
              {pastRequests.length === 0 ? (
                <p>No past requests found.</p>
              ) : (
                <ul className="past-request-list">
                  {pastRequests.map((req, idx) => (
                    <li key={idx} className="past-request-item">
                      <p>
                        <strong>Subject:</strong> {req.subject_name} (
                        {req.subject_type})
                      </p>
                      <p>
                        <strong>Component:</strong> {req.component_name}
                      </p>
                      <p>
                        <strong>Sub-Component:</strong> {req.sub_component_name}
                      </p>
                      <p>
                        <strong>Reason:</strong> {req.reason}
                      </p>
                      <p>
                        <strong>Status:</strong> {req.status}
                      </p>
                      <hr />
                    </li>
                  ))}
                </ul>
              )}
              <Button text="Close" onClick={() => setShowPastRequests(false)} />
            </div>
          )}

          <RedFooter />
        </div>
      </div>
    </div>
  );
};

export default FacCorrectionReq;
