import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, UserPlus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { BACKEND_URL } from "../../../config";
import { useSelector } from "react-redux";
import RedHeader from "../../components/RedHeader";
import ActivityHeader from "../../components/ActivityHeader";
import Sidebar from "../../components/Sidebar";
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import RedFooter from "../../components/RedFooter";
import "./admin.css";
import SessionDisplay from "../../components/SessionDisplay";

const BranchManagement = () => {
  const { userId, role, token, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role != "admin") {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }

  const currentSession = useSelector((state) => state.session.currentSession);

  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    branch_id: "",
    branch_name: "",
  });

  // Fetch all branches
  const fetchBranches = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/branch`, {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch branches");
      }

      const data = await response.json();
      setBranches(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch branches");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/branch`, {
        method: "POST",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add branch");
      }

      toast.success("Course added successfully");
      fetchBranches();
      setFormData({ branch_id: "", branch_name: "" });
    } catch (error) {
      toast.error(error.message || "Failed to add branch");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/branch/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete branch");
      }

      toast.success("Branch deleted successfully");
      fetchBranches();
    } catch (error) {
      toast.error(error.message || "Failed to delete branch");
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
              <div className="fac-alloc">
                <h3>Branch Management</h3>
                <SessionDisplay className="session-text" />

                <span className="box-overlay-text">Add Details</span>
                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>
                  <div className="space-y-6">
                    <Toaster position="top-right" />
                    <div className="flex justify-between items-center"></div>

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4 p-4 bg-white rounded-lg shadow"
                    >
                      <input
                        type="text"
                        name="branch_id"
                        value={formData.branch_id}
                        onChange={handleChange}
                        placeholder="Branch ID"
                        className="input-fac w-full px-3 py-2 border rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        name="branch_name"
                        value={formData.branch_name}
                        onChange={handleChange}
                        placeholder="Branch Name"
                        className="input-fac w-full px-3 py-2 border rounded-lg"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                      >
                        Add Branch
                      </button>
                    </form>

                    <div className="bg-white rounded-lg shadow">
                      <div className="subject-table-container">
                        <table className="subject-table">
                          <thead>
                            <tr>
                              <th>Branch Id</th>
                              <th>Branch Name</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {branches.map((branch) => (
                              <tr key={branch.branch_id}>
                                <td>{branch.branch_id}</td>
                                <td>{branch.branch_name}</td>
                                <td>
                                  <button
                                    onClick={() =>
                                      handleDelete(branch.branch_id)
                                    }
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
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
          </div>
        </div>
        <RedFooter />
      </div>
    </div>
  );
};

export default BranchManagement;
