import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

function MarksFeed() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  // const faculty_id = user?.faculty_id;
  // const coData = useSelector((state) => state.co.coData);

  const [subject, setSubject] = useState("");
  const [component, setComponent] = useState("");
  const [test, setTest] = useState("");
  const [students, setStudents] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [maxMarks, setMaxMarks] = useState("");
  const [marksData, setMarksData] = useState({
    CO1: "",
    CO2: "",
    CO3: "",
    CO4: "",
    CO5: "",
  });

  const subjects = [
    "IT38502 - DBMS (T)",
    "IT38502 - DBMS (P)",
    "IT38509 - ACN (T)",
    "IT38509 - ACN (P)",
  ];

  const isTheory = subject.includes("(T)");
  const isPractical = subject.includes("(P)");

  // Component options based on subject selection
  const componentOptions = isTheory
    ? ["CW", "Theory"]
    : isPractical
    ? ["SW", "Practical"]
    : [];

  const testOptions = {
    CW: ["MST 1", "MST 2", "Assignment 1", "Assignment 2"],
    Theory: ["Theory"],
    SW: ["Viva 1", "Viva 2"],
    Practical: ["External Viva", "External Submission"],
  };

  // sample student data
  const fetchStudents = () => {
    const dummyStudents = [
      { id: 1, enrollment: "0801IT221017", name: "Arjun Bhattrai" },
      { id: 1, enrollment: "0801IT221022", name: "Ananya Joshi" },
      { id: 2, enrollment: "0801IT221030", name: "Dipesh Prajapat" },
      { id: 3, enrollment: "0801IT221082", name: "Laxita Thakur" },
      { id: 4, enrollment: "0801IT221090", name: "Sumit Khandekar" },
    ];
    setStudents(dummyStudents);
    setShowTable(true);
  };

  const handleMarksChange = (studentId, value) => {
    if (!maxMarks) return;

    // Allow numbers <= maxMarks and 'A' for absent
    if (
      value === "A" ||
      (value !== "" && !isNaN(value) && Number(value) <= Number(maxMarks))
    ) {
      setMarksData((prev) => ({ ...prev, [studentId]: value }));
    }
  };

  const allCOsFilled = Object.values(maxMarks).every((value) => value !== "");

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
                  <span className="hod-name">
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
                <div className="fac-alloc">
                  <h3>Marks Feeding</h3>
                  <p className="session-text">Current Session: June 2025</p>

                  <span className="box-overlay-text">Enter details</span>

                  <div className="faculty-box">
                    <div className="marks-feeding-dropdown-container">
                      <Dropdown
                        label="Subject"
                        options={subjects}
                        selectedValue={subject}
                        onChange={(value) => {
                          setSubject(value);
                          setComponent("");
                          setTest("");
                        }}
                      />

                      <Dropdown
                        label="Component"
                        options={componentOptions}
                        selectedValue={component}
                        onChange={(value) => {
                          setComponent(value);
                          setTest("");
                        }}
                        disabled={!subject}
                      />

                      <Dropdown
                        label="Test"
                        options={component ? testOptions[component] : []}
                        selectedValue={test}
                        onChange={setTest}
                        disabled={!component}
                      />
                    </div>

                    {test && (
                      <div className="max-marks-container">
                        <label>Enter Max Marks CO-Wise:</label>
                        
                        {[1, 2, 3, 4, 5].map((co) => (
                          <div key={co} className="co-max-marks">
                            <label>CO {co}:</label>
                            <input
                              type="number"
                              value={maxMarks[`CO${co}`]}
                              onChange={(e) => handleMaxMarksChange(`CO${co}`, e.target.value)}
                              min="0"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      text="Proceed"
                      navigateTo="/fac-marks-entry"
                      state={{ subject, component, test, maxMarks }} // Passing state
                      disabled={!test || !allCOsFilled}
                    />
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
}

export default MarksFeed;
