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
  if (!isAuthenticated || role !== "faculty") {
    return <div>You are not authorized to view this page.</div>;
  }
  const currentSession = useSelector((state) => state.session.currentSession);

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [component, setComponent] = useState("");
  const [subComponent, setSubComponent] = useState("");
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");
  const [stage, setStage] = useState(1);
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
    const fetchPastRequests = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/req/past-requests/${userId}`,
          {
            method: "GET",
            headers: {
              authorization: token,
            },
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to load past requests");

        setPastRequests(data.requests || []);
      } catch (err) {
        toast.error("Could not fetch past requests");
        console.error(err);
      }
    };

    fetchPastRequests();
  }, [token, userId]);

  const handleWithdraw = async (requestId) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/req/withdraw/${requestId}`,
        {
          method: "POST",
          headers: {
            authorization: token,
          },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to withdraw request");

      toast.success("Request withdrawn");
      setPastRequests((prev) => prev.filter((r) => r.request_id !== requestId));
    } catch (err) {
      toast.error("Could not withdraw request");
      console.error(err);
    }
  };

  const handleProceed = async (req) => {
    try {
      const query = new URLSearchParams({
        subject_id: req.subject_id,
        subject_type: req.subject_type,
        component_name: req.component_name,
        sub_component_name: req.sub_component_name,
        form_status: req.form_status,
      }).toString();

      const response = await fetch(
        `${BACKEND_URL}/api/req/form-check?${query}`,
        {
          method: "GET",
          headers: { authorization: token },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.submitted) {
        toast.error("Form not found or not submitted");
        return;
      }

      window.location.href = `/faculty/edit-form?subject_id=${req.subject_id}&subject_type=${req.subject_type}&component=${req.component_name}&sub_component=${req.sub_component_name}&status=${req.form_status}`;
    } catch (err) {
      toast.error("Error proceeding to form");
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
                  <span className="user-name">{userId && [`${userId}`]}</span>
                </p>
                <p>
                  <span className="user-role">Role: </span>
                  <span className="user-name">[{role && `${role}`}]</span>
                </p>
              </div>

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
                  {pastRequests.length === 0 ? (
                    <p>No correction requests found.</p>
                  ) : (
                    <table className="request-table">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Type</th>
                          <th>Component</th>
                          <th>Sub-Component</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastRequests.map((req) => (
                          <tr key={req.request_id}>
                            <td>{req.subject_name}</td>
                            <td>{req.subject_type}</td>
                            <td>{req.component_name || "-"}</td>
                            <td>{req.sub_component_name || "-"}</td>
                            <td>{req.status}</td>
                            <td>
                              {req.status === "Rejected" && (
                                <span>Rejected</span>
                              )}
                              {req.status === "Pending" && (
                                <Button
                                  text="Withdraw"
                                  onClick={() => handleWithdraw(req.request_id)}
                                />
                              )}
                              {req.status === "Approved" && (
                                <Button
                                  text="Proceed"
                                  onClick={() => handleProceed(req)}
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <div className="draft-btn-container">
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
            {stage === 1 ? (
              <>
                <h2>Draft New Request</h2>
                <Dropdown
                  label="Form Status"
                  options={[
                    { value: "Regular", label: "Regular" },
                    { value: "ATKT", label: "ATKT" },
                  ]}
                  selectedValue={draftStatus}
                  onChange={(val) => {
                    setDraftStatus(val);
                    setComponent("");
                    setSubComponent("");
                  }}
                />

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

                {draftStatus === "Regular" && (
                  <>
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
                  </>
                )}

                <div className="modal-actions">
                  <Button
                    text="Proceed"
                    onClick={async () => {
                      if (!draftStatus || !selectedSubject.subject_id) {
                        toast.error("Please select all fields");
                        return;
                      }

                      const query = new URLSearchParams({
                        subject_id: selectedSubject.subject_id,
                        subject_type: selectedSubject.subject_type,
                        component_name: component,
                        sub_component_name: subComponent,
                        form_status: draftStatus,
                      }).toString();

                      const response = await fetch(
                        `${BACKEND_URL}/api/req/form-check?${query}`,
                        {
                          headers: { authorization: token },
                        }
                      );

                      const data = await response.json();

                      if (!response.ok || !data.submitted) {
                        toast.error("Form not submitted yet.");
                        return;
                      }

                      setStage(2); // move to reason entry
                    }}
                  />
                  <Button text="Cancel" onClick={() => setShowModal(false)} />
                </div>
              </>
            ) : (
              <>
                <h2>Submit Correction Request</h2>
                <p>
                  <strong>Subject:</strong> {selectedSubject.subject_name}
                </p>
                <p>
                  <strong>Type:</strong> {selectedSubject.subject_type}
                </p>
                <p>
                  <strong>Status:</strong> {draftStatus}
                </p>
                {draftStatus === "Regular" && (
                  <>
                    <p>
                      <strong>Component:</strong> {component}
                    </p>
                    <p>
                      <strong>Sub-Component:</strong> {subComponent}
                    </p>
                  </>
                )}

                <textarea
                  rows="6"
                  placeholder="Enter reason..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>

                <div className="modal-actions">
                  <Button
                    text="Submit Request"
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `${BACKEND_URL}/api/req/submit-request`,
                          {
                            method: "POST",
                            headers: {
                              authorization: token,
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              subject_id: selectedSubject.subject_id,
                              subject_type: selectedSubject.subject_type,
                              component_name:
                                draftStatus === "Regular" ? component : null,
                              sub_component_name:
                                draftStatus === "Regular" ? subComponent : null,
                              reason,
                              form_status: draftStatus,
                            }),
                          }
                        );

                        const data = await res.json();
                        if (!res.ok)
                          throw new Error(data.error || "Submit failed");

                        toast.success("Request submitted");
                        setShowModal(false);
                        setReason("");
                        setStage(1);
                        setDraftStatus("");
                        setSelectedSubject({});
                        setPastRequests((prev) => [data.newRequest, ...prev]); // optional: refresh manually
                      } catch (err) {
                        toast.error(err.message);
                        console.error(err);
                      }
                    }}
                  />
                  <Button text="Back" onClick={() => setStage(1)} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FacCorrectionReq;
