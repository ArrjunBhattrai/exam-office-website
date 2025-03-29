import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./admin.css";
import Sidebar from "../../../components/Sidebar";
import ActivityHeader from "../../../components/ActivityHeader";
import RedFooter from "../../../components/RedFooter";
import RedHeader from "../../../components/RedHeader";
import Dropdown from "../../../components/Dropdown";
import Button from "../../../components/Button";
import { FaHome, FaSignOutAlt, FaEye, FaTrash } from "react-icons/fa";

const AdminNewSub = () => {
  const user = useSelector((state) => state.auth.user);
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      subject_code: "CSE101",
      name: "Computer Science Basics",
      branch: "CSE",
      semester: "1",
    },
    {
      id: 2,
      subject_code: "IT202",
      name: "Data Structures",
      branch: "IT",
      semester: "3",
    },
    {
      id: 3,
      subject_code: "ECE303",
      name: "Digital Electronics",
      branch: "ECE",
      semester: "5",
    },
    {
      id: 4,
      subject_code: "EI404",
      name: "Microprocessors",
      branch: "EI",
      semester: "7",
    },
  ]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formData, setFormData] = useState({
    subject_code: "",
    name: "",
    branch: "",
    semester: "",
    syllabus: "",
    numCOs: 0,
    COs: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/...")
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle COs input
  const handleCOChange = (index, value) => {
    const updatedCOs = [...formData.COs];
    updatedCOs[index] = value;
    setFormData({ ...formData, COs: updatedCOs });
  };

  // Handle number of COs
  const handleNumCOsChange = (e) => {
    const numCOs = parseInt(e.target.value, 10);
    setFormData({ ...formData, numCOs, COs: Array(numCOs).fill("") });
  };

  // Delete subject
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      axios
        .delete(`http://localhost:5000/api/subjects/${id}`)
        .then(() => {
          setSubjects(subjects.filter((subject) => subject.id !== id));
        })
        .catch((error) => console.error("Error deleting subject:", error));
    }
  };

  // Open View/Edit Modal
  const handleView = (subject) => {
    setSelectedSubject(subject);
    setShowModal(true);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/subjects", formData)
      .then(() => {
        alert("Subject created successfully!");
        setShowForm(false);
      })
      .catch((error) => console.error("Error creating subject:", error));
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
                className="sidebar-1"
                title="Faculty Activity"
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
                  onClick={() => (window.location.href = "/fac-home")}
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
                    [{user?.name || "Please Login"}]
                  </span>
                </p>
                <p>
                  <span className="hod-role">Role: </span>
                  <span className="hod-name">
                    [{user?.role || "Please Login"}]
                  </span>
                </p>
                <p>
                  <span className="hod-role">Department: </span>
                  <span className="hod-name">
                    [{user?.department || "Please Login"}]
                  </span>
                </p>
              </div>

              <div>
                {/* here */}
                <div className="fac-alloc">
                  <h3>Subject Management</h3>
                  <p className="session-text">Current Session: June 2025</p>

                  <span className="box-overlay-text">Manage subjects</span>

                  <div className="faculty-box">
                    <p className="institute-text">
                      <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                      TECHNOLOGY & SCIENCE
                    </p>

                    <div className="subject-table-container">
                    <table className="subject-table">
                      <thead>
                        <tr>
                          <th>Subject Code</th>
                          <th>Name</th>
                          <th>Branch</th>
                          <th>Semester</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.map((subject) => (
                          <tr key={subject.id}>
                            <td>{subject.subject_code}</td>
                            <td>{subject.name}</td>
                            <td>{subject.branch}</td>
                            <td>{subject.semester}</td>
                            <td>
                              <button className="icon-btn">
                                <FaEye /> View
                              </button>
                              <button className="icon-btn">
                                <FaTrash /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                    
                    <Button text="Create New Subject" onClick={() => setShowForm(true)} />

                {showForm && (
  <div className="modal-overlay">
    <div className="subject-form-container">
      <button className="close-btn" onClick={() => setShowForm(false)}>
        &times;
      </button>

      <h2>Create New Subject</h2>
      <form onSubmit={handleSubmit} className="subject-form">
        <label>Subject Code:</label>
        <input type="text" name="subject_code" value={formData.subject_code} onChange={handleChange} required />

        <label>Subject Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Branch:</label>
        <input type="text" name="branch" value={formData.branch} onChange={handleChange} required />

        <label>Semester:</label>
        <input type="number" name="semester" value={formData.semester} onChange={handleChange} required />

        <label>Syllabus:</label>
        <textarea name="syllabus" value={formData.syllabus} onChange={handleChange} required />

        <label>Number of COs:</label>
        <input type="number" name="numCOs" value={formData.numCOs} onChange={handleNumCOsChange} required />

        {formData.COs.map((_, index) => (
          <div key={index}>
            <label>CO {index + 1}:</label>
            <textarea value={formData.COs[index]} onChange={(e) => handleCOChange(index, e.target.value)} required />
          </div>
        ))}

        <div className="form-buttons">
          <Button text="Submit" type="submit" />
          <Button text="Cancel" onClick={() => setShowForm(false)} />
        </div>
      </form>
    </div>
  </div>
)}


                    {/* View/Edit Modal */}
                    {showModal && selectedSubject && (
                      <div className="modal">
                        <div className="modal-content">
                          <h2>Edit Subject</h2>
                          <label>Subject Code:</label>
                          <input
                            type="text"
                            value={selectedSubject.subject_code}
                            readOnly
                          />

                          <label>Branch:</label>
                          <Dropdown
                            options={["CSE", "IT", "ECE", "EI"]}
                            selectedValue={selectedSubject.branch}
                            onChange={(value) =>
                              setSelectedSubject({
                                ...selectedSubject,
                                branch: value,
                              })
                            }
                          />

                          <label>Semester:</label>
                          <Dropdown
                            options={["1", "2", "3", "4", "5", "6", "7", "8"]}
                            selectedValue={selectedSubject.semester}
                            onChange={(value) =>
                              setSelectedSubject({
                                ...selectedSubject,
                                semester: value,
                              })
                            }
                          />

                          <label>Syllabus:</label>
                          <textarea
                            value={selectedSubject.syllabus}
                            onChange={(e) =>
                              setSelectedSubject({
                                ...selectedSubject,
                                syllabus: e.target.value,
                              })
                            }
                          />

                          <div className="modal-buttons">
                            <Button
                              text="Save Changes"
                              onClick={() => {
                                /* Update API call */
                              }}
                            />
                            <Button
                              text="Close"
                              onClick={() => setShowModal(false)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RedFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminNewSub;
