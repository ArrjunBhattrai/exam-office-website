import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
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
  const [inputMarks, setInputMarks] = useState({});
  const [savedMarks, setSavedMarks] = useState({});
  const [inputWarnings, setInputWarnings] = useState({});

  const subjectOptions = assignedSubjects.length
    ? assignedSubjects.map((subject) => ({
        value: JSON.stringify({
          subject_id: subject.subject_id,
          subject_type: subject.subject_type,
          subject_name: subject.subject_name,
        }),
        label: `${subject.subject_id} -${subject.subject_type.charAt(0)}`,
      }))
    : [{ value: "", label: "No subjects assigned" }];

  const componentMap = {
    Elective: ["CW", "Theory"],
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
        `${BACKEND_URL}/api/subject/faculty-subjects/${userId}`,
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
        `${BACKEND_URL}/api/subject/get-co/${selectedSubject.subject_id}/${selectedSubject.subject_type}`,
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

  const fetchStudents = async (selectedSubject, token) => {
    if (!selectedSubject?.subject_id || !selectedSubject?.subject_type) {
      return [];
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/student/getStudents?subject_id=${selectedSubject.subject_id}&subject_type=${selectedSubject.subject_type}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch students");

      const data = await response.json();
      return data;
    } catch (err) {
      toast.error(err.message || "Failed to fetch students");
      return [];
    }
  };

  const handleProceed = async () => {
    if (!selectedSubject.subject_id || !component || !subComponent) {
      toast.error("Please select all fields");
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        subject_id: selectedSubject.subject_id,
        subject_type: selectedSubject.subject_type,
        component_name: component,
        sub_component_name: subComponent,
      }).toString();

      const marksRes = await fetch(
        `${BACKEND_URL}/api/assesment/fetch-marks-data?${queryParams}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const marksData = await marksRes.json();

      if (!marksRes.ok) {
        throw new Error(marksData.message || "Failed to check marks status");
      }

      if (marksData.status === "submitted") {
        toast("Marks already submitted. Cannot edit.");
        setSelectedSubject({});
        setComponent("");
        setSubComponent("");
        return;
      }

      if (marksData.status === "saved") {
        const savedMarks = marksData.saved_marks;
        const testDetails = marksData.test_details;

        const cosMap = {};
        testDetails.forEach(({ co_name, max_marks }) => {
          cosMap[co_name] = max_marks;
        });
        setSelectedCos(cosMap);

        const marksObj = {};
        savedMarks.forEach(({ enrollment_no, co_name, marks_obtained }) => {
          if (!marksObj[enrollment_no]) {
            marksObj[enrollment_no] = {};
          }
          marksObj[enrollment_no][co_name] = marks_obtained;
        });
        setSavedMarks(marksObj);
        const studentData = await fetchStudents(selectedSubject, token);
        setStudents(studentData);
        setShowMarksTable(true);
        return;
      }

      const testDetailsRes = await fetch(
        `${BACKEND_URL}/api/assesment/fetch-test-details?${queryParams}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const testDetailsData = await testDetailsRes.json();

      if (!testDetailsRes.ok) {
        throw new Error(
          testDetailsData.message || "Failed to check test details"
        );
      }

      if (testDetailsData.exists) {
        const cosMap = {};
        testDetailsData.co_marks.forEach(({ co_name, max_marks }) => {
          cosMap[co_name] = max_marks;
        });
        setSelectedCos(cosMap);
        const studentData = await fetchStudents(selectedSubject, token);
        setStudents(studentData);
        setShowMarksTable(true);
        return;
      }

      const data = await fetchCos();
      if (data?.length > 0) {
        setCos(data);
        setShowModal(true);
      } else {
        toast.error("No COs found for the selected subject.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred in proceeding");
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
        `${BACKEND_URL}/api/assesment/insert-test-details`,
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
      const studentData = await fetchStudents(selectedSubject, token);
      setStudents(studentData);
      setShowMarksTable(true);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleMarksChange = (enrollment_no, coName, value) => {
    const numericValue = value === "" ? "" : Number(value);
    const maxMark = selectedCos[coName];

    const savedValue = savedMarks[enrollment_no]?.[coName];

    let warning = "";

    if (numericValue !== "" && (isNaN(numericValue) || numericValue < 0)) {
      warning = "Invalid input";
    } else if (numericValue > maxMark) {
      warning = `Cannot exceed max marks (${maxMark})`;
    }

    setInputWarnings((prevWarnings) => ({
      ...prevWarnings,
      [enrollment_no]: {
        ...prevWarnings[enrollment_no],
        [coName]: warning,
      },
    }));

    if (!warning) {
      setInputMarks((prevInputMarks) => {
        if (numericValue === savedValue || numericValue === "") {
          if (prevInputMarks[enrollment_no]) {
            const { [coName]: _, ...restCos } = prevInputMarks[enrollment_no];
            const newInputMarks = { ...prevInputMarks };

            if (Object.keys(restCos).length === 0) {
              delete newInputMarks[enrollment_no];
            } else {
              newInputMarks[enrollment_no] = restCos;
            }

            return newInputMarks;
          }
          return prevInputMarks;
        } else {
          return {
            ...prevInputMarks,
            [enrollment_no]: {
              ...prevInputMarks[enrollment_no],
              [coName]: numericValue,
            },
          };
        }
      });
    }
  };

  const calculateTotal = (enrollment_no) => {
    return Object.keys(selectedCos).reduce((total, coName) => {
      const inputValue = inputMarks[enrollment_no]?.[coName];
      const savedValue = savedMarks[enrollment_no]?.[coName];
      const value = inputValue !== undefined ? inputValue : savedValue;
      return total + (value ? Number(value) : 0);
    }, 0);
  };

  const handleSave = async () => {
    try {
      const payload = [];

      for (const student of students) {
        const enrollment_no = student.enrollment_no;

        if (Object.keys(savedMarks).length > 0 && !inputMarks[enrollment_no]) {
          continue;
        }

        const entry = {
          enrollment_no,
          subject_id: selectedSubject.subject_id,
          subject_type: selectedSubject.subject_type,
          component_name: component,
          sub_component_name: subComponent,
          co_marks: {},
        };

        if (inputMarks[enrollment_no]) {
          for (const co of Object.keys(inputMarks[enrollment_no])) {
            const value = inputMarks[enrollment_no][co];

            if (value !== "" && value !== null && value !== undefined) {
              entry.co_marks[co] = value;
            }
          }
        }

        if (Object.keys(entry.co_marks).length > 0) {
          payload.push(entry);
        }
      }

      if (payload.length === 0) {
        toast("No changes to save.");
        return;
      }

      console.log("Payload to save:", payload);

      const response = await fetch(`${BACKEND_URL}/api/assesment/save-marks`, {
        method: "POST",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: payload }),
      });

      if (!response.ok) throw new Error("Failed to save marks");

      toast.success("Marks saved successfully!");
      setShowMarksTable(false);
    } catch (err) {
      toast.error(err.message || "Something went wrong while saving");
    }
  };

  const handleCancel = async () => {
    const hasInput = Object.keys(inputMarks).length > 0;
    const hasSaved = Object.keys(savedMarks).length > 0;

    const resetForm = () => {
      setSelectedSubject({});
      setComponent("");
      setSubComponent("");
      setStudents([]);
      setSelectedCos({});
      setSavedMarks({});
      setInputMarks({});
      setShowMarksTable(false);
    };

    if (hasSaved) {
      if (hasInput) {
        const confirmCancel = window.confirm(
          "You have unsaved changes. Are you sure you want to cancel? Changes will be lost."
        );
        if (!confirmCancel) return;
      }
      resetForm();
    } else {
      if (hasInput) {
        const confirmCancel = window.confirm(
          "You have unsaved changes.Changes will be lost and test details will be deleted. Proceed?"
        );
        if (!confirmCancel) return;
      }

      try {
        const queryParams = new URLSearchParams({
          subject_id: selectedSubject.subject_id,
          subject_type: selectedSubject.subject_type,
          component_name: component,
          sub_component_name: subComponent,
        }).toString();

        const deleteRes = await fetch(
          `${BACKEND_URL}/api/assesment/delete-test-details?${queryParams}`,
          {
            method: "DELETE",
            headers: {
              authorization: token,
            },
          }
        );

        if (!deleteRes.ok) {
          const errData = await deleteRes.json();
          throw new Error(errData.message || "Failed to delete test details");
        }

        toast.success("Test details deleted successfully.");
      } catch (err) {
        toast.error(err.message || "Error while deleting test details");
      }

      resetForm();
    }
  };

  const handleSubmit = async () => {
    try {
      const coNames = Object.keys(selectedCos);
      const isNewForm = Object.keys(savedMarks).length === 0;

      const combinedData = {};

      for (const student of students) {
        const enrollment = student.enrollment_no;
        const combinedCOs = {};

        if (!isNewForm && savedMarks[enrollment]) {
          for (const co of coNames) {
            combinedCOs[co] = savedMarks[enrollment][co] ?? "";
          }
        }

        if (inputMarks[enrollment]) {
          for (const co of coNames) {
            if (
              inputMarks[enrollment][co] !== null &&
              inputMarks[enrollment][co] !== undefined &&
              inputMarks[enrollment][co] !== ""
            ) {
              combinedCOs[co] = inputMarks[enrollment][co];
            }
          }
        }

        combinedData[enrollment] = combinedCOs;
      }

      for (const student of students) {
        const enrollment = student.enrollment_no;

        if (!combinedData[enrollment]) {
          toast.error(`Missing marks for ${enrollment}`);
          return;
        }

        for (const co of coNames) {
          const mark = combinedData[enrollment][co];
          if (mark === undefined || mark === null || mark === "") {
            toast.error(`Missing marks for ${enrollment} under ${co}`);
            return;
          }
        }
      }

      const payload = students.map((student) => ({
        enrollment_no: student.enrollment_no,
        subject_id: selectedSubject.subject_id,
        subject_type: selectedSubject.subject_type,
        component_name: component,
        sub_component_name: subComponent,
        co_marks: combinedData[student.enrollment_no],
      }));

      const response = await fetch(
        `${BACKEND_URL}/api/assesment/submit-marks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({ data: payload }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit marks");

      toast.success("Marks submitted successfully!");
      setShowMarksTable(false);
      setInputMarks({});
      setSavedMarks({});
    } catch (err) {
      toast.error(err.message || "Error during submission");
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
                    name: "ATKT Marks Feeding",
                    path: "/faculty/atkt-marks-feed",
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
                    <Toaster position="top-right" />
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
                    {!showMarksTable && (
                      <Button text="Proceed" onClick={handleProceed} />
                    )}
                    {showMarksTable && (
                      <div className="overflow-auto border rounded-xl mt-4">
                        <table className="min-w-full table-auto border-collapse">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="border px-4 py-2 text-left">
                                Enrollment No
                              </th>
                              <th className="border px-4 py-2 text-left">
                                Student Name
                              </th>
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
                              <th className="border px-4 py-2 text-left">
                                Total Marks Obtained
                              </th>
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
                                      <td
                                        key={coName}
                                        className="border px-4 py-2"
                                      >
                                        <input
                                          type="number"
                                          className="w-full px-2 py-1 border rounded-md"
                                          value={
                                            inputMarks[student.enrollment_no]?.[
                                              coName
                                            ] ??
                                            savedMarks[student.enrollment_no]?.[
                                              coName
                                            ] ??
                                            ""
                                          }
                                          onChange={(e) =>
                                            handleMarksChange(
                                              student.enrollment_no,
                                              coName,
                                              e.target.value
                                            )
                                          }
                                        />
                                        {inputWarnings?.[
                                          student.enrollment_no
                                        ]?.[coName] && (
                                          <p className="text-red-600 text-sm mt-1">
                                            {
                                              inputWarnings[
                                                student.enrollment_no
                                              ][coName]
                                            }
                                          </p>
                                        )}
                                      </td>
                                    )
                                )}

                                <td className="border px-4 py-2 font-semibold">
                                  {calculateTotal(student.enrollment_no)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="flex gap-4 mt-4">
                          <Button text="Save" onClick={handleSave} />
                          <Button text="Submit" onClick={handleSubmit} />
                          <Button text="Cancel" onClick={handleCancel} />
                        </div>
                      </div>
                    )}
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

          <RedFooter />
        </div>
      </div>
    </div>
  );
}

export default MarksFeed;
