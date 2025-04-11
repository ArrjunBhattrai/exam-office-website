import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
// import "./HODHome.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const ViewSubjects = () => {
  const user = useSelector((state) => state.auth.user);
  const faculty_id = user?.faculty_id;

  const [facultyId, setFacultyId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [coValues, setCoValues] = useState({});

  const fetchSubjects = async () => {
    if (!facultyId.trim()) {
      // alert("Please enter Faculty ID");
      // return;

      // Sample Data when Faculty ID is empty
      const sampleData = [
        {
          subject_id: "IT58302",
          subject_name: "Data Structures",
          year_semester: "2nd Year, Sem 3",
        },
        {
          subject_id: "IT58309",
          subject_name: "Operating Systems",
          year_semester: "2nd Year, Sem 3",
        },
      ];
      setSubjects(sampleData);
      return;
    }
    try {
      const response = await axios.get(`/api/faculty/subjects/${facultyId}`);
      setSubjects(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch subjects");
    }
  };

  const handleCoChange = (subjectId, value) => {
    setCoValues((prev) => ({
      ...prev,
      [subjectId]: value,
    }));
  };

  const submitCOs = async () => {
    const coData = Object.keys(coValues).map((subjectId) => ({
      subject_id: subjectId,
      co_count: coValues[subjectId],
    }));

    try {
      await axios.post("/api/faculty/submit-co", facultyId, coData);
      alert("No. of COs submitted");
    } catch (error) {
      console.error("Error submitting CO:", error);
      alert("Failed to submit COs");
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
                className="sidebar-1"
                title="Faculty Activity"
                activities={[
                  { name: "View Assigned Subjects", path: "/fac-view-sub" },
                  { name: "Marks Feeding Activities", path: "/fac-marks-feed" },
                  {
                    name: "Make Correction Request",
                    path: "/fac-correction-req",
                  },
                ]}
              />
            </div>

            <div className="user-info">
              <div className="user-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/fac-home")}
                >
                  <FaHome className="icon" /> Home
                </button>
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/")}
                >
                  <FaSignOutAlt className="icon" /> Logout
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

              <div>
                {/* here */}
                <div className="fac-alloc">
                  <h3>View Assigned Subjects</h3>
                  <p className="session-text">Current Session: June 2025</p>

                  <span className="box-overlay-text">Select to view</span>

                  <div className="faculty-box">
                    <input
                      type="text"
                      placeholder="Enter Faculty ID"
                      value={facultyId}
                      onChange={(e) => setFacultyId(e.target.value)}
                      className="fac-input"
                    />
                    <button className="fetch-btn" onClick={fetchSubjects}>
                      Fetch Subjects
                    </button>

                    {subjects.length > 0 && (
                      <div className="subject-list">
                        {subjects.map((subject) => (
                          <div
                            key={subject.subject_id}
                            className="subject-item"
                          >
                            <span>
                              {subject.subject_name} ({subject.subject_id}) -{" "}
                              {subject.year_semester}
                            </span>
                            <input
                              type="number"
                              placeholder="Enter COs"
                              value={coValues[subject.subject_id] || ""}
                              onChange={(e) =>
                                handleCoChange(
                                  subject.subject_id,
                                  e.target.value
                                )
                              }
                              className="co-input"
                            />
                          </div>
                        ))}
                        <button className="submit-btn" onClick={submitCOs}>
                          Submit COs
                        </button>
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

export default ViewSubjects;
