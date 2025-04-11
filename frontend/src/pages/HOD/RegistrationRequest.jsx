import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import "./hod.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { BACKEND_URL } from "../../../config";

const RegistrationRequest = () => {
  const { userId, isAuthenticated, role, token } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role != "hod") {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }

  const [pendingRequests, setPendingRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/hod/faculty/requests`, {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch registration requests");
      }

      const data = await response.json();
      setPendingRequests(data);
      console.log(pendingRequests);
    } catch (error) {
      toast.error(error.message || "Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleAction = async (faculty_id, action) => {
    try {
      let endpoint = "";
      let method = "";

      if (action === "approve") {
        endpoint = "/api/hod/faculty/requests/approve";
        method = "POST";
      } else if (action === "reject") {
        endpoint = "/api/hod/faculty/requests/reject";
        method = "DELETE";
      } else {
        throw new Error("Invalid action type");
      }

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: method,
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ faculty_id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${action} request`);
      }

      toast.success(`Request ${action}ed successfully`);
      fetchRequests();
    } catch (error) {
      toast.error(error.message || "Failed to perform the required action");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

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
                title="HOD Activity"
                activities={[
                  {
                    name: "View Department Details",
                    path: "/hod/department-details",
                  },
                  {
                    name: "Registration Requests",
                    path: "/hod/registration-request",
                  },

                  {
                    name: "Faculty Allocation",
                    path: "/hod/faculty-allocation",
                  },
                  {
                    name: "View Correction Requests",
                    path: "/hod/correction-request",
                  },
                  { name: "Progress Report", path: "/hod/progress-report" },
                ]}
              />
            </div>

            <div className="user-info">
              <div className="user-icons">
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

              <div className="fac-alloc">
                <h3>Registration Requests</h3>
                <p className="session-text">Current Session: June 2025</p>

                <span className="box-overlay-text">View Requests</span>

                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>

                  {pendingRequests.length === 0 ? (
                    <p>No pending registration requests.</p>
                  ) : (
                    <table className="request-table">
                      <thead>
                        <tr>
                          <th>S. No.</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRequests.map((req, index) => (
                          <tr key={req.faculty_id}>
                            <td>{index + 1}</td>
                            <td>{req.faculty_name}</td>
                            <td>{req.faculty_email}</td>
                            <td>
                              <button
                                onClick={() =>
                                  handleAction(req.faculty_id, "approve")
                                }
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleAction(req.faculty_id, "reject")
                                }
                                style={{ marginLeft: "10px", color: "red" }}
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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

export default RegistrationRequest;
