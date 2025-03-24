import React, { useState, useEffect } from "react";
import { setCOData } from "../../../redux/actions/coActions";
import { useSelector } from "react-redux";
import axios from "axios";
// import "./HODHome.css";
import Sidebar from "../../../components/Sidebar";
import ActivityHeader from "../../../components/ActivityHeader";
import RedFooter from "../../../components/RedFooter";
import RedHeader from "../../../components/RedHeader";
import Dropdown from "../../../components/Dropdown";
import Button from "../../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

const ViewSubjects = () => {
  const user = useSelector((state) => state.auth.user);
  const faculty_id = user?.faculty_id;

  // const [facultyId, setFacultyId] = useState("");
  const [subjects, setSubjects] = useState([
    //sample data
    {
      subject_id: "CS101",
      subject_name: "Data Structures",
      year_semester: "2nd Year, Semester 3",
    },
    {
      subject_id: "CS102",
      subject_name: "Database Management Systems",
      year_semester: "2nd Year, Semester 4",
    },
    {
      subject_id: "CS103",
      subject_name: "Operating Systems",
      year_semester: "3rd Year, Semester 5",
    },
  ]);
  const [coValues, setCoValues] = useState({});

  useEffect(() => {
    if (faculty_id) {
      // fetchSubjects(); --> uncomment when actual data available
    }
  }, [faculty_id]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`/api/faculty/subjects/${faculty_id}`);
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
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
      await axios.post("/api/faculty/assign-co", {
        faculty_id,
        coData,
      });
      alert("No. of COs submitted successfully!");
    } catch (error) {
      console.error("Error submitting CO:", error);
      alert("Failed to submit COs");
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
                className="sidebar-1"
                title="Faculty Activity"
                activities={[
                  { name: "View Assigned Subjects", path: "/fac-view-sub" },
                  { name: "Marks Feeding", path: "/fac-marks-feed" },
                  {
                    name: "Make Correction Request",
                    path: "/fac-correction-req",
                  },
                ]}
              />

              <Sidebar
                className="sidebar-2"
                title="Form Dashboard"
                activities={[
                  { name: "View Saved Form", path: "/fac-saved-form" },
                  { name: "View Filled Form", path: "/fac-filled-form" },
                  { name: "Delete Filled Form", path: "/fac-delete-form" },
                ]}
              />
            </div>

            <div className="hod-info">
              <div className="hod-icons">
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
                  <h3>View Assigned Subjects</h3>
                  <p className="session-text">Current Session: June 2025</p>

                  <span className="box-overlay-text">Select to view</span>

                  <div className="faculty-box">

                    

                    {subjects.length > 0 ? (
                    <div className="subject-list">
                      {subjects.map((subject) => (
                        <div key={subject.subject_id} className="subject-item">
                          <span>{subject.subject_name} ({subject.subject_id}) - {subject.year_semester}</span>
                          <input
                            type="number"
                            placeholder="Enter COs"
                            value={coValues[subject.subject_id] || ""}
                            onChange={(e) => handleCoChange(subject.subject_id, e.target.value)}
                            className="co-input"
                          />
                        </div>
                      ))}
                      <button className="submit-btn" onClick={submitCOs}>Submit COs</button>
                    </div>
                  ) : (
                    <p>No subjects assigned.</p>
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
