import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./admin.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import { BACKEND_URL } from "../../../config";
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const AdminRequest = () => {
  const { userId, isAuthenticated, role, token } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role != "admin") {
    return <div>Please log in to access this page.</div>;
  }

  const [requests, setRequests] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/req/correction-requests`, {
          method: "GET",
          headers: {
            authorization: token,
          },
        });
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        toast.error("Failed to fetch requests");
      }
    };

    fetchRequests();
  }, [token]);

  const handleUpdateStatus = async (request_id, newStatus) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/req/correction-requests/${request_id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        toast.error("Failed to update status");
        return;
      }

      toast.success(`Request ${newStatus}`);
      setRequests((prev) =>
        prev.map((req) =>
          req.request_id === request_id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      toast.error("Server error");
    }
  };

  const handleView = (reason, request_id) => {
    setSelectedReason(reason);
    setSelectedRequestId(request_id);
    setShowReasonModal(true);
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
                className="sidebar"
                title="Admin Activities"
                activities={[
                  {
                    name: "Session Management",
                    path: "/admin/session-management",
                  },
                  {
                    name: "Branch Management",
                    path: "/admin/branch-management",
                  },
                  {
                    name: "Course Management",
                    path: "/admin/course-management",
                  },
                  {
                    name: "Upload Subject Data",
                    path: "/admin/subject-data-upload",
                  },
                  {
                    name: "Upload Student Data",
                    path: "/admin/student-data-upload",
                  },
                  {
                    name: "Upload Data for ATKT",
                    path: "/admin/atkt-data-upload",
                  },
                  { name: "Address Requests", path: "/admin/req" },
                ]}
              />
            </div>

            <div className="user-info">
              <div className="user-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/admin/home")}
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
                  <span className="user-name">
                    [{(role && `${role}`) || "Please Login"}]
                  </span>
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

                  <span className="box-overlay-text">View request</span>

                  <div className="faculty-box">
                    <table className="request-table">
                      <thead>
                        <tr>
                          <th>Request ID</th>
                          <th>Faculty</th>
                          <th>Subject</th>
                          <th>Type</th>
                          <th>Component</th>
                          <th>Sub Component</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req) => (
                          <tr key={req.request_id}>
                            <td>{req.request_id}</td>
                            <td>
                              {req.faculty_id} - {req.faculty_name}
                            </td>
                            <td>{req.subject_name}</td>
                            <td>{req.subject_type}</td>
                            <td>{req.component_name}</td>
                            <td>{req.sub_component_name}</td>
                            <td>{req.status}</td>
                            <td>
                              <Button
                                text="View"
                                onClick={() =>
                                  handleView(req.reason, req.request_id)
                                }
                              />
                              <Button
                                text="Approve"
                                onClick={() =>
                                  handleUpdateStatus(req.request_id, "Approved")
                                }
                              />
                              <Button
                                text="Reject"
                                onClick={() =>
                                  handleUpdateStatus(req.request_id, "Rejected")
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RedFooter />
      </div>

      {showReasonModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Reason for Request #{selectedRequestId}</h2>
            <p>{selectedReason}</p>
            <div className="modal-actions">
              <Button text="Close" onClick={() => setShowReasonModal(false)} />
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default AdminRequest;
