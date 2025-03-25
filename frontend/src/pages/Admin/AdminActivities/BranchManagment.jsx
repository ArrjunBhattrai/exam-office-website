import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, UserPlus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { BACKEND_URL } from "../../../../config";
import { useSelector } from "react-redux";

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    branch_name: "",
    course_id: "",
    hod_id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editBranchId, setEditBranchId] = useState(null);
  const { token } = useSelector((state) => state.auth);

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
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Branch Management</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 bg-white rounded-lg shadow"
      >
        <input
          type="text"
          name="branch_name"
          value={formData.branch_name}
          onChange={handleChange}
          placeholder="Branch Name"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="course_id"
          value={formData.course_id}
          onChange={handleChange}
          placeholder="Course ID"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="hod_officer_id"
          value={formData.hod_officer_id}
          onChange={handleChange}
          placeholder="HOD ID"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          {isEditing ? "Update Branch" : "Add Branch"}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HOD ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {branches.map((branch) => (
                <tr key={branch.branch_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {branch.branch_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {branch.course_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {branch.hod_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(branch)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(branch.branch_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleAssignHod(branch.branch_id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <UserPlus className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BranchManagement;
