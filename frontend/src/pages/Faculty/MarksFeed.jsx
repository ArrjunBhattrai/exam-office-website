import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import "./faculty.css";
import { BACKEND_URL } from "../../../config";

function MarksFeed() {
  const { userId, isAuthenticated, role, token } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role !== "faculty") {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [component, setComponent] = useState("");
  const [subComponent, setSubComponent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cos, setCos] = useState([]);
  const [selectedCos, setSelectedCos] = useState({});
  const [students, setStudents] = useState([]);
  const [showMarksTable, setShowMarksTable] = useState(false);
  const [marks, setMarks] = useState({});

  const subjectOptions = assignedSubjects.length
    ? assignedSubjects.map((subject) => ({
        value: JSON.stringify({
          subject_id: subject.subject_id,
          subject_type: subject.subject_type,
          subject_name: subject.subject_name,
        }),
        label: `${subject.subject_name} - ${subject.subject_type}`,
      }))
    : [{ value: "", label: "No subjects assigned" }];

  const componentMap = {
    Theory: ["CW", "Theory"],
    Practical: ["SW", "Practical"],
  };

  const subComponentMap = {
    CW: ["MST 1", "MST 2", "Assignment 1", "Assignment 2"],
    Theory: ["Theory Exam"],
    SW: ["Viva 1", "Viva 2"],
    Practical: ["External Viva", "External Submission"],
  };

  const componentOptions = selectedSubject?.subject_type
    ? componentMap[selectedSubject.subject_type] || []
    : [];

  const subComponentOptions = component ? subComponentMap[component] || [] : [];

  const fetchAssignedSubjects = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/faculty/assignedSubjects/${userId}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assigned Subjects");
      }

      const data = await response.json();
      setAssignedSubjects(data.subjects);
    } catch (error) {
      toast.error(error.message || "Failed to fetch Assigned Subjects");
    }
  };
  useEffect(() => {
    fetchAssignedSubjects();
  }, [token]);

  const fetchCos = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/faculty/get-co/${selectedSubject.subject_id}/${selectedSubject.subject_type}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("failed to fetch COs");

      const data = await response.json();
      return data;
    } catch (err) {
      toast.error(err.message || "Failed to fetch COs");
    }
  };

  const handleProceed = async () => {
    if (selectedSubject.subject_id && component && subComponent) {
      const data = await fetchCos();

      setCos(data);

      if (data.length > 0) {
        setShowModal(true);
      } else {
        toast.error("No COs found for the selected subject.");
      }
    } else {
      toast.error("Please select all fields");
    }
  };

  const handleCheckboxChange = (co) => {
    setSelectedCos((prev) => {
      const updated = { ...prev };
      if (updated[co] !== undefined) {
        delete updated[co];
      } else {
        updated[co] = "";
      }
      return updated;
    });
  };

  const handleMaxMarksChange = (co, value) => {
    setSelectedCos((prev) => ({
      ...prev,
      [co]: value,
    }));
  };

  const handleModalSubmit = async () => {
    const co_marks = Object.entries(selectedCos)
      .filter(([_, marks]) => marks !== undefined && marks !== "")
      .map(([co_name, max_marks]) => ({
        co_name,
        max_marks: Number(max_marks),
      }));

    if (!co_marks.length) {
      toast.error("Please select at least one CO with max marks");
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/faculty/insert-test-details`,
        {
          method: "POST",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject_id: selectedSubject.subject_id,
            subject_type: selectedSubject.subject_type,
            component_name: component,
            sub_component_name: subComponent,
            co_marks,
          }),
        }
      );

      if (!response.ok) throw new Error("Submission failed");

      toast.success("CO marks saved successfully!");
      setShowModal(false);

      const fetchStudents = await fetch(
        `${BACKEND_URL}/api/faculty/getStudents/${selectedSubject.subject_id}/${selectedSubject.subject_type}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!fetchStudents.ok) throw new Error("Failed to fetch students");

      const studentData = await fetchStudents.json();
      setStudents(studentData.students);
      setShowMarksTable(true);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleMarksChange = (e) => {
    const { name, value } = e.target;
  
    const [enrollment_no, co_name] = name.split("-");
    const maxMarks = Number(selectedCos[co_name]);
  
    if (value === "" || (!isNaN(value) && Number(value) <= maxMarks)) {
      setMarks((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      toast.error(`Marks for ${co_name} cannot exceed ${maxMarks}`);
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
                  {
                    name: "View Assigned Subjects",
                    path: "/faculty/view-subjects",
                  },
                  {
                    name: "Marks Feeding Activities",
                    path: "/faculty/marks-feed",
                  },
                  {
                    name: "Make Correction Request",
                    path: "/faculty/correction-request",
                  },
                ]}
              />
            </div>

            <div className="user-info">
              <div className="user-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/faculty/home")}
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

              <div>
                <div className="fac-alloc">
                  <h3>Marks Feeding</h3>
                  <p className="session-text">Current Session: June 2025</p>

                  <span className="box-overlay-text">Enter details</span>

                  <div className="faculty-box">
                    <div className="marks-feeding-dropdown-container">
                      <Dropdown
                        label="Subject"
                        options={subjectOptions}
                        selectedValue={JSON.stringify(selectedSubject)}
                        onChange={(value) => {
                          const parsedValue = JSON.parse(value);
                          setSelectedSubject(parsedValue);
                          setComponent("");
                          setSubComponent("");
                        }}
                      />

                      <Dropdown
                        label="Component"
                        options={componentOptions.map((comp) => ({
                          value: comp,
                          label: comp,
                        }))}
                        selectedValue={component}
                        onChange={(value) => {
                          setComponent(value);
                          setSubComponent("");
                        }}
                      />

                      <Dropdown
                        label="Sub Component"
                        options={subComponentOptions.map((sub) => ({
                          value: sub,
                          label: sub,
                        }))}
                        selectedValue={subComponent}
                        onChange={setSubComponent}
                      />
                    </div>

                    <Button text="Proceed" onClick={handleProceed} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>
                  {selectedSubject.subject_name} -{" "}
                  {selectedSubject.subject_type}
                  <br />
                  {component} / {subComponent}
                </h3>

                <hr style={{ margin: "10px 0" }} />

                {cos && cos.length > 0 ? (
                  cos.map((co) => (
                    <div key={co} className="modal-co-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedCos[co] !== undefined}
                          onChange={() => handleCheckboxChange(co)}
                        />
                        {co}
                      </label>
                      {selectedCos[co] !== undefined && (
                        <input
                          type="number"
                          placeholder="Max Marks"
                          value={selectedCos[co]}
                          onChange={(e) =>
                            handleMaxMarksChange(co, e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p>No Course Outcomes available.</p>
                )}

                <div className="modal-buttons">
                  <button
                    onClick={() => setShowModal(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button onClick={handleModalSubmit} className="save-btn">
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          )}

          {showMarksTable && (
            <div className="overflow-auto border rounded-xl mt-4">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">
                      Enrollment No
                    </th>
                    <th className="border px-4 py-2 text-left">Student Name</th>
                    {Object.keys(selectedCos).map(
                      (coName) =>
                        selectedCos[coName] && (
                          <th
                            key={coName}
                            className="border px-4 py-2 text-left"
                          >
                            {coName}
                          </th>
                        )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        {student.enrollment_no}
                      </td>
                      <td className="border px-4 py-2">
                        {student.student_name}
                      </td>
                      {Object.keys(selectedCos).map(
                        (coName) =>
                          selectedCos[coName] && (
                            <td key={coName} className="border px-4 py-2">
                              <input
                                type="number"
                                className="w-full px-2 py-1 border rounded-md"
                                name={`${student.enrollment_no}-${coName}`}
                                onChange={handleMarksChange}
                              />
                            </td>
                          )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <RedFooter />
        </div>
      </div>
    </div>
  );
}

export default MarksFeed;
