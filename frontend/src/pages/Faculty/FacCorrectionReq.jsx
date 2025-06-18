import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
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

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [component, setComponent] = useState("");
  const [subComponent, setSubComponent] = useState("");
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pastRequests, setPastRequests] = useState([]);

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

  const componentOptions = selectedSubject?.subject_type
    ? componentMap[selectedSubject.subject_type] || []
    : [];

  const subComponentOptions = component ? subComponentMap[component] || [] : [];

  useEffect(() => {
    if (!isAuthenticated || role !== "faculty") return;

    const fetchAssignedSubjects = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/subject/faculty-subjects/${userId}`,
          {
            method: "GET",
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch assigned Subjects");

        const data = await res.json();
        setAssignedSubjects(data.subjects);
      } catch (err) {
        toast.error(err.message || "Error fetching subjects.");
      }
    };

    const fetchPastRequests = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/req/past-requests/${userId}`,
          {
            method: "GET",
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Failed to fetch past requests");

        setPastRequests(data.requests || []);
      } catch (err) {
        toast.error("Failed to load past requests");
        console.error(err);
      }
    };

    fetchAssignedSubjects();
    fetchPastRequests();
  }, [isAuthenticated, role, token, userId]);

  const handleSubmitRequest = async () => {
    if (
      !selectedSubject.subject_id ||
      !component ||
      !subComponent ||
      !reason.trim()
    ) {
      toast.error("Please complete all fields.");
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
      if (!res.ok) throw new Error(data.error || "Failed to submit request");

      toast.success("Request submitted successfully");
      setReason("");
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || "Request failed");
    }
  };

  if (!isAuthenticated || role !== "faculty") {
    return <div>You are not authorized to view this page.</div>;
  }

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
                  { name: "Edit Personal Info", path: "/faculty/edit-info" },
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
                  <span className="user-name">{userId && [`${userId}`]}</span>
                </p>
                <p>
                  <span className="user-role">Role: </span>
                  <span className="user-name">[{role && `${role}`}]</span>
                </p>
              </div>

              <div className="fac-alloc">
                <h3>Correction Request</h3>
                <p className="session-text">Current Session: June 2025</p>
                <span className="box-overlay-text">Draft a request</span>

                <div className="faculty-box">
                  <br/>
                  <h4>Past Correction Requests</h4>
                  {pastRequests.length === 0 ? (
                    <p>No past requests found.</p>
                  ) : (
                    <table className="request-table">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Type</th>
                          <th>Component</th>
                          <th>Sub-Component</th>
                          <th>Reason</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastRequests.map((req, idx) => (
                          <tr key={idx}>
                            <td>{req.subject_name}</td>
                            <td>{req.subject_type}</td>
                            <td>{req.component_name}</td>
                            <td>{req.sub_component_name}</td>
                            <td>{req.reason}</td>
                            <td>{req.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <div className="text-center mt-4">
                    <Button
                      text="Draft New Request"
                      onClick={() => setShowModal(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <RedFooter />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Submit Correction Request</h2>
            <Dropdown
              label="Subject"
              options={subjectOptions}
              selectedValue={JSON.stringify(selectedSubject)}
              onChange={(value) => {
                const parsed = JSON.parse(value);
                setSelectedSubject(parsed);
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

            <textarea
              rows="8"
             
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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FacCorrectionReq;
