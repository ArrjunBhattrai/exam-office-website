"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function CollegeManager() {
  const [colleges, setColleges] = useState([]);
  const [collegeName, setCollegeName] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all colleges
  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/colleges");
      setColleges(data.data);
    } catch (err) {
      setError("Failed to fetch colleges");
    } finally {
      setLoading(false);
    }
  };

  // Handle College Submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!collegeName) {
      setError("College name is required");
      return;
    }

    try {
      setLoading(true);
      if (selectedCollege) {
        await axios.put("/api/colleges", {
          college_id: selectedCollege.college_id,
          college_name: collegeName,
        });
      } else {
        await axios.post("/api/colleges", { college_name: collegeName });
      }
      fetchColleges();
      resetForm();
    } catch (err) {
      setError("Failed to save college");
    } finally {
      setLoading(false);
    }
  };

  // Handle College Delete
  const handleDelete = async (college_id) => {
    if (!window.confirm("Are you sure you want to delete this college?"))
      return;

    try {
      setLoading(true);
      await axios.delete("/api/colleges", { data: { college_id } });
      fetchColleges();
    } catch (err) {
      setError("Failed to delete college");
    } finally {
      setLoading(false);
    }
  };

  // Reset Form
  const resetForm = () => {
    setCollegeName("");
    setSelectedCollege(null);
    setError("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Colleges</h2>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* College Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          placeholder="Enter college name"
          className="border p-2 w-full mb-3 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {selectedCollege ? "Update College" : "Add College"}
        </button>
        {selectedCollege && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-3 text-gray-500"
          >
            Cancel
          </button>
        )}
      </form>

      {/* College List */}
      {loading ? (
        <p>Loading colleges...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">College Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {colleges.length > 0 ? (
              colleges.map((college) => (
                <tr key={college.college_id} className="text-center">
                  <td className="border p-2">{college.college_id}</td>
                  <td className="border p-2">{college.college_name}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => {
                        setCollegeName(college.college_name);
                        setSelectedCollege(college);
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(college.college_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border p-2 text-center">
                  No colleges found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
