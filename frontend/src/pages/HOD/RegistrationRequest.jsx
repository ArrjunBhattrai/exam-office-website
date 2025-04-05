import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./hod.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const RegistrationRequest = () => {
  const user = useSelector((state) => state.auth.user);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    // Mock data for local testing
    const mockData = [
      {
        faculty_id: "F101",
        faculty_name: "Dr. Radhika Sharma",
        faculty_email: "radhika.sharma@sgsits.ac.in",
      },
      {
        faculty_id: "F102",
        faculty_name: "Prof. Anil Verma",
        faculty_email: "anil.verma@sgsits.ac.in",
      },
      {
        faculty_id: "F103",
        faculty_name: "Ms. Sneha Patil",
        faculty_email: "sneha.patil@sgsits.ac.in",
      },
      {
        faculty_id: "F104",
        faculty_name: "Dr. Vikram Jain",
        faculty_email: "vikram.jain@sgsits.ac.in",
      },
    ];
    setPendingRequests(mockData);
  }, []);
  

  // const fetchRequests = async () => {
  //   try {
  //     const res = await axios.get("/api/hod/pending-faculty-requests"); // Match your actual endpoint
  //     setPendingRequests(res.data.requests);
  //   } catch (error) {
  //     console.error("Error fetching requests", error);
  //   }
  // };
  

  // const handleAction = async (faculty_id, action) => {
  //   try {
  //     if (action === "approve") {
  //       await axios.post("/api/hod/approve-faculty", { faculty_id });
  //     } else {
  //       await axios.post("/api/hod/reject-faculty", { faculty_id });
  //     }
  //     fetchRequests(); // Refresh the list after action
  //   } catch (error) {
  //     alert("Action failed");
  //     console.error(error);
  //   }
  // };
  

  // useEffect(() => {
  //   fetchRequests();
  // }, []);

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
                    path: "/hod-deptt-details",
                  },
                  { name: "Faculty Allocation", path: "/hod-fac-alloc" },
                  { name: "Registration Requests", path: "/hod-reg-req" },
                  {
                    name: "View Correction Requests",
                    path: "/hod-correction-req",
                  },
                  { name: "Progress Report", path: "/hod-prog-report" },
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

              <div className="fac-alloc">
                <h3>Registration Requests</h3>
                <p className="session-text">Current Session: June 2025</p>

                <span className="box-overlay-text">
                  View Requests
                </span>

                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>
                  {/* When a faculty registers , they have to send request to the hod for 
                  approving there registration request, all these request shall be displayed here 
                  to the hod in a tabular manner, 
                  the table includes:
                  1. S. No.
                  2. Username & email of the person registering
                  the hod can either reject or approve these requests, only after approval can the faculty log in
                  also note that only the regsitration happening as Faculty gets sent to the hod */}

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
