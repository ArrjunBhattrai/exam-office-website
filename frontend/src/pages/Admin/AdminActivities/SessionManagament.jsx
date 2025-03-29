import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, UserPlus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { BACKEND_URL } from "../../../../config";
import { useSelector } from "react-redux";
import RedHeader from "../../../components/RedHeader";
import ActivityHeader from "../../../components/ActivityHeader";
import Sidebar from "../../../components/Sidebar";
import Dropdown from "../../../components/Dropdown";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import RedFooter from "../../../components/RedFooter";
import "./admin.css";

const SessionManagement = () => {
  const {
    officer_id,
    isAuthenticated,
    officer_name,
    user_type,
    email,
    department_id,
    token,
  } = useSelector((state) => state.auth);
  // const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    branch_name: "",
    course_id: "",
    hod_id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editBranchId, setEditBranchId] = useState(null);
  const [branch, setBranch] = useState("SELECT");
  // const { token } = useSelector((state) => state.auth);

  // Fetch all branches
  const fetchBranches = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/department/branch`, {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch branches");
      }

      const data = await response.json();
      setBranches(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch branches");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(token);
      const url = isEditing
        ? `${BACKEND_URL}/api/department/branches/${editBranchId}`
        : `${BACKEND_URL}/api/department/branch`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      toast.success(
        isEditing
          ? "Branch updated successfully"
          : "Branch created successfully"
      );

      fetchBranches();
      setFormData({ branch_name: "", course_id: "", hod_id: "" });
      setIsEditing(false);
      setEditBranchId(null);
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleEdit = (branch) => {
    setFormData(branch);
    setIsEditing(true);
    setEditBranchId(branch.branch_id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/department/branches/${id}`,
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

  const handleAssignHod = async (id) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/department/branches/${id}/assign-hod`,
        {
          method: "POST",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hod_id: formData.hod_id }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to assign HOD");
      }

      toast.success("HOD assigned successfully");
      fetchBranches();
    } catch (error) {
      toast.error(error.message || "Failed to assign HOD");
    }
  };

  return (
    <div className="hod-home-container">
      <div className="hod-bg">
        <RedHeader />
        <div className="hod-content">
          <ActivityHeader />
          <div className="hod-main">
            <div className="sidebars">
              <Sidebar
                className="sidebar-0"
                title="Admin Activities"
                activities={[
                  { name: "Course Management", path: "/course-management" },
                    { name: "Branch Management", path: "/branch-management" },
                    { name: "Session Management", path: "/session-management" },
                    { name: "Upload Marking Scheme", path: "/admin-upload" },
                    { name: "Faculty Management", path: "/faculty-management" },
                    { name: "Assign HOD", path: "/assign-hod" },
                    { name: "Upload Student Data", path: "/admin-upload" },
                    { name: "Address Requests", path: "/admin-req" },
                    { name: "Progress Report", path: "/admin-prog-report" },
                  
              ]}
              />
            </div>
            <div className="hod-info">
              <div className="hod-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/admin-home")}
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

              <div className="hod-sec">
                <p>
                  <span>Welcome: </span>
                  <span className="hod-name">
                    {officer_name && `[${officer_name}]`}
                  </span>
                </p>
                <p>
                  <span className="hod-role">Role: </span>
                  <span className="hod-name">
                    [{(user_type && `${user_type}`) || "Please Login"}]
                  </span>
                </p>
              </div>
              <div className="fac-alloc">
                <h3>Session Management</h3>
                <p className="session-text">Current Session: June 2025</p>
                <span className="box-overlay-text">Add Details</span>
                <div className="faculty-box">
                  <p className="institute-text">
                    <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                    TECHNOLOGY & SCIENCE
                  </p>

                  <div className="bg-white p-4 rounded shadow mt-4">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const response = await fetch(
                            `${BACKEND_URL}/api/sessions`,
                            {
                              method: "POST",
                              headers: {
                                authorization: token,
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                start_date: formData.start_date,
                                end_date: formData.end_date,
                                branch_id: formData.branch_id,
                                semester: formData.semester,
                              }),
                            }
                          );

                          if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(
                              errorData.message || "Failed to create session"
                            );
                          }

                          toast.success("Session created successfully");
                          setFormData({
                            start_date: "",
                            end_date: "",
                            branch_id: "",
                            semester: "",
                          });
                        } catch (error) {
                          toast.error(error.message || "Operation failed");
                        }
                      }}
                      className="space-y-3"
                    >
                      <div className="session">
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date:
                        </label>
                        <input
                          type="date"
                          name="start_date"
                          value={formData.start_date}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded"
                          required
                        />
                      </div>
                      <div className="session">
                        <label className="block text-sm font-medium text-gray-700">
                          End Date:
                        </label>
                        <input
                          type="date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded"
                          required
                        />
                      </div>
                      <div className="session">
                      <div className="dropdown-container">
  <Dropdown
    label="Branch"
    options={["CSE", "IT", "ECE", "EI"]}
    selectedValue={formData.branch_id}
    onChange={(value) => setFormData({ ...formData, branch_id: value })}
  />
</div>

                      </div>
                      <div className="session">
                        <label className="block text-sm font-medium text-gray-700">
                          Semester:
                        </label>
                        <input
                          type="number"
                          name="semester"
                          value={formData.semester}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded"
                          min="1"
                          max="8"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Create Session
                      </button>
                    </form>
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

export default SessionManagement;
