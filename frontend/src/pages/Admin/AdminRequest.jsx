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

const AdminRequest = () => {
  const { userId, isAuthenticated, role, token } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role != "admin") {
    return <div>Please log in to access this page.</div>;
  }

  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/req/correction-requests`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setRequests(data.requests || []);
      } catch (err) {
        console.error("Error fetching correction requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleAction = async (requestId, status) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/req/correction-requests/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.request_id === requestId ? { ...r, status } : r))
        );
      } else {
        console.error("Failed to update request");
      }
    } catch (err) {
      console.error("Error updating request:", error);
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
                  onClick={() => (window.location.href = "/admin-home")}
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
                  <p className="session-text">Current Session: June 2025</p>

                  <span className="box-overlay-text">View request</span>

                  <div className="faculty-box">
                    {loading ? (
                      <p>Loading requests...</p>
                    ) : (
                      <div className="request-table-container">
                        <table className="request-table">
                          <thead>
                            <tr>
                              <th>Faculty</th>
                              <th>Subject</th>
                              <th>Component</th>
                              <th>Sub-Component</th>
                              <th>Reason</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {requests.map((req) => (
                              <tr key={req.request_id}>
                                <td>{req.faculty_name}</td>
                                <td>{req.subject_name}</td>
                                <td>{req.component_name}</td>
                                <td>{req.sub_component_name}</td>
                                <td>{req.reason}</td>
                                <td>{req.status}</td>
                                <td>
                                  {req.status === "Pending" && (
                                    <>
                                      <button
                                        className="approve-btn"
                                        onClick={() =>
                                          handleAction(
                                            req.request_id,
                                            "Approved"
                                          )
                                        }
                                      >
                                        Approve
                                      </button>
                                      <button
                                        className="reject-btn"
                                        onClick={() =>
                                          handleAction(
                                            req.request_id,
                                            "Rejected"
                                          )
                                        }
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  {req.status !== "Pending" && (
                                    <span>{req.status}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RedFooter />
      </div>
    </div>
  );
};

export default AdminRequest;
