import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import { BACKEND_URL } from "../../../config";
import "./faculty.css";
import SessionDisplay from "../../components/SessionDisplay";

const ViewSubjects = () => {
  const { userId, isAuthenticated, role, token, branchId } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role != "faculty") {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [coInput, setCoInput] = useState("");

  const openModal = (subject) => {
    setSelectedSubject(subject);
    setCoInput("");
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedSubject(null);
    setShowModal(false);
  };

  const fetchAssignedSubjects = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/subject/${userId}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "Application/json",
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

  const handleAssignCOs = async () => {
    const numberOfCOs = parseInt(coInput);

    if (!numberOfCOs || isNaN(numberOfCOs) || numberOfCOs < 1) {
      toast.warn("Please enter a valid number of COs");
      return;
    }

    const co_names = Array.from(
      { length: numberOfCOs },
      (_, i) => `CO${i + 1}`
    );

    try {
      const response = await fetch(`${BACKEND_URL}/api/subject/assign-co`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({
          subject_id: selectedSubject.subject_id,
          subject_type: selectedSubject.subject_type,
          co_names,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Failed to assign COs"
        );
      }

      toast.success("COs assigned successfully!");
      await fetchAssignedSubjects();
      setShowModal(false);
      setTimeout(() => setSelectedSubject(null), 300);
    } catch (error) {
      toast.error(error.message || "Failed to assign COs");
    }
  };

  return (
    <div className="home-container">
      <Toaster position="top-right" />
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
                  <FaHome className="icon" /> Home
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
                  <FaSignOutAlt className="icon" /> Logout
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
                  <h3>View Assigned Subjects</h3>
                  <SessionDisplay className="session-text" />

                  <span className="box-overlay-text">Select to view</span>
                  <div className="faculty-box">
                    <h4>Assigned Subjects Table</h4>
                    <table className="subject-table">
                      <thead>
                        <tr>
                          <th>Course</th>
                          <th>Subject</th>
                          <th>Subject Name</th>
                          <th>Semester</th>
                          <th>No. of COs</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignedSubjects.map((subject) => {
                          const key = `${subject.subject_id}-${subject.subject_type}`;

                          // Build course name
                          const courseDisplay =
                            subject.specialization?.toLowerCase() !== "none"
                              ? `${subject.course_id} - ${subject.specialization}`
                              : subject.course_id;

                          // Build subject code display
                          const subjectDisplay = `${subject.subject_id} - ${subject.subject_type}`;

                          return (
                            <tr key={key}>
                              <td>{courseDisplay}</td>
                              <td>{subjectDisplay}</td>
                              <td>{subject.subject_name}</td>
                              <td>{subject.semester}</td>
                              <td>
                                {subject.co_names.length > 0 ? (
                                  subject.co_names.length
                                ) : (
                                  <span style={{ color: "gray" }}>
                                    COs not assigned
                                  </span>
                                )}
                              </td>
                              <td>
                                {subject.co_names?.length > 0 ? (
                                  <span
                                    style={{
                                      color: "green",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    COs already assigned
                                  </span>
                                ) : (
                                  <button
                                    className="assign-btn"
                                    onClick={() => openModal(subject)}
                                  >
                                    Assign COs
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {showModal && selectedSubject && (
                      <div className="modal-overlay">
                        <div className="modal">
                          <h3>Assign COs</h3>
                          <p>
                            <strong>Subject:</strong>{" "}
                            {selectedSubject.subject_name}
                          </p>
                          <p>
                            <strong>Code:</strong> {selectedSubject.subject_id}
                          </p>
                          <p>
                            <strong>Type:</strong>{" "}
                            {selectedSubject.subject_type}
                          </p>

                          <input
                            type="number"
                            min="1"
                            placeholder="Enter number of COs"
                            value={coInput}
                            onChange={(e) => setCoInput(e.target.value)}
                          />

                          <div className="modal-actions">
                            <button onClick={closeModal}>Cancel</button>
                            <button onClick={() => handleAssignCOs()}>
                              Submit
                            </button>
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

export default ViewSubjects;
