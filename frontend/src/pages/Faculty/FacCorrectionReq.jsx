import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../utils/logout";
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
import SessionDisplay from "../../components/SessionDisplay";

const FacCorrectionReq = () => {
  const { userId, isAuthenticated, role, token } = useSelector(
    (state) => state.auth
  );
  if (!isAuthenticated || role !== "faculty") {
    return <div>You are not authorized to view this page.</div>;
  }

  const dispatch = useDispatch();
  const handleLogout = () => {
    logoutUser(dispatch);
  };
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [component, setComponent] = useState("");
  const [subComponent, setSubComponent] = useState("");
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");
  const [stage, setStage] = useState(1);
  const [pastRequests, setPastRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [marks, setMarks] = useState([]);
  const [testDetails, setTestDetails] = useState([]);

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

  const fetchAssignedSubjects = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/subject/${userId}`, {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

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

  useEffect(() => {
    const fetchPastRequests = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/request/`, {
          method: "GET",
          headers: {
            authorization: token,
          },
        });

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
      const response = await fetch(`${BACKEND_URL}/api/request/${requestId}`, {
        method: "DELETE",
        headers: {
          authorization: token,
        },
      });

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
      const response = await fetch(
        `${BACKEND_URL}/api/request/marks/${req.request_id}`,
        {
          headers: { authorization: token },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to fetch marks");
        return;
      }

      setEditingRequest(req);
      setMarks(data.marks || []);
      setTestDetails(data.test_details || []);
      setEditModalOpen(true);
    } catch (err) {
      toast.error("Error loading mark data");
      console.error(err);
    }
  };

  const fetchRegularStudents = async () => {
    try {
      const query = new URLSearchParams({
        subject_id: selectedSubject.subject_id,
        subject_type: selectedSubject.subject_type,
        faculty_id: userId,
      }).toString();

      const response = await fetch(`${BACKEND_URL}/api/student?${query}`, {
        headers: { authorization: token },
      });

      const data = await response.json();
      setStudents(data || []);
      setSelectedEnrollments([]);
    } catch (err) {
      toast.error("Could not fetch students");
      console.error(err);
    }
  };

  const fetchATKTStudents = async () => {
    try {
      const query = new URLSearchParams({
        subject_id: selectedSubject.subject_id,
        subject_type: selectedSubject.subject_type,
      }).toString();

      const response = await fetch(
        `${BACKEND_URL}/api/atkt/students?${query}`,
        {
          headers: { authorization: token },
        }
      );

      const data = await response.json();
      setStudents(data || []);
      setSelectedEnrollments([]);
    } catch (err) {
      toast.error("Could not fetch ATKT students");
      console.error(err);
    }
  };

  const handleMarkChange = (value, index) => {
    const updated = [...marks];
    const coName = updated[index].co_name;
    const maxMark = testDetails.find((t) => t.co_name === coName)?.max_marks;

    const newVal = Number(value);
    if (newVal > maxMark) {
      toast.error(`Marks for ${coName} cannot exceed max (${maxMark})`);
      return;
    }

    updated[index].marks_obtained = newVal;
    setMarks(updated);
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
                  onClick={() => (window.location.href = "/faculty/home")}
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
                  onClick={handleLogout}
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
                <SessionDisplay className="session-text" />
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
                            <td>{req.subject_id}</td>
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
                        `${BACKEND_URL}/api/request/check?${query}`,
                        {
                          headers: { authorization: token },
                        }
                      );

                      const data = await response.json();

                      if (!response.ok) {
                        toast.error("Form not submitted yet.");
                        return;
                      }
                      if (draftStatus === "Regular") {
                        await fetchRegularStudents();
                      } else {
                        await fetchATKTStudents();
                      }
                      setStage(2);
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

                <h4>Select Students (Enrollment Numbers)</h4>
                <div className="student-checkbox-list">
                  {students.map((stu) => (
                    <label key={stu.enrollment_no}>
                      <input
                        type="checkbox"
                        value={stu.enrollment_no}
                        checked={selectedEnrollments.includes(
                          stu.enrollment_no
                        )}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const value = e.target.value;
                          setSelectedEnrollments((prev) =>
                            checked
                              ? [...prev, value]
                              : prev.filter((val) => val !== value)
                          );
                        }}
                      />
                      {stu.enrollment_no} - {stu.student_name}
                    </label>
                  ))}
                </div>

                <div className="modal-actions">
                  <Button
                    text="Submit Request"
                    onClick={async () => {
                      try {
                        if (selectedEnrollments.length === 0) {
                          toast.error("Please select at least one student");
                          return;
                        }
                        const res = await fetch(`${BACKEND_URL}/api/request/`, {
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
                            enrollment_nos: selectedEnrollments,
                          }),
                        });

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

      {editModalOpen && editingRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Marks - {editingRequest.subject_name}</h2>
            <table className="request-table">
              <thead>
                <tr>
                  <th>Enrollment No</th>
                  <th>CO Name</th>
                  <th>Max Marks</th>
                  <th>Marks Obtained</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.enrollment_no}</td>
                    <td>{entry.co_name}</td>
                    <td>
                      {testDetails.find((t) => t.co_name === entry.co_name)
                        ?.max_marks || "-"}
                    </td>
                    <td>
                      <input
                        type="number"
                        value={entry.marks_obtained}
                        onChange={(e) =>
                          handleMarkChange(e.target.value, index)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="modal-actions">
              <Button
                text="Resubmit"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `${BACKEND_URL}/api/request/resubmit`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          authorization: token,
                        },
                        body: JSON.stringify({
                          request_id: editingRequest.request_id,
                          subject_id: editingRequest.subject_id,
                          subject_type: editingRequest.subject_type,
                          component_name:
                            editingRequest.form_status === "Regular"
                              ? editingRequest.component_name
                              : null,
                          sub_component_name:
                            editingRequest.form_status === "Regular"
                              ? editingRequest.sub_component_name
                              : null,
                          form_status: editingRequest.form_status,
                          updatedMarks: marks,
                        }),
                      }
                    );

                    const data = await res.json();
                    if (!res.ok)
                      throw new Error(data.error || "Resubmit failed");

                    toast.success("Form resubmitted successfully");
                    setEditModalOpen(false);
                    setEditingRequest(null);
                    setMarks([]);
                    setTestDetails([]);
                    setPastRequests((prev) =>
                      prev.map((r) =>
                        r.request_id === editingRequest.request_id
                          ? { ...r, status: "Resubmitted" }
                          : r
                      )
                    );
                  } catch (err) {
                    toast.error(err.message || "Resubmit failed");
                    console.error(err);
                  }
                }}
              />
              <Button
                text="Cancel"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingRequest(null);
                  setMarks([]);
                  setTestDetails([]);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FacCorrectionReq;
