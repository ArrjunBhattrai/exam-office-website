import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./hod.css";
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import Dropdown from "../../components/Dropdown";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { BACKEND_URL } from "../../../config";
import { Toaster, toast } from "react-hot-toast";

const ElectiveDataUpload = () => {
  const { userId, isAuthenticated, role, token, branchId } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role != "hod") {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }
  const currentSession = useSelector((state) => state.session.currentSession);

  const [subjects, setSubjects] = useState([]);
  const [electiveOptions, setElectiveOptions] = useState([]);
  const [selectedElective, setSelectedElective] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [file, setFile] = useState(null);

  const fetchElectiveSubjects = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/elective`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setSubjects(data);
        const options = data.map((subj) => ({
          value: `${subj.subject_id}___${subj.subject_type}`,
          label: `${subj.subject_name} (${subj.subject_id})`,
        }));
        setElectiveOptions(options);
      } else {
        setSubjects([]);
        setElectiveOptions([{ value: "", label: "No subjects available" }]);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch electives");
    }
  };
  useEffect(() => {
    fetchElectiveSubjects();
  }, [token]);

  const selectedSubjectData = subjects.find(
    (s) =>
      selectedElective &&
      `${s.subject_id}___${s.subject_type || "electtive"}` === selectedElective
  );

  const handleUpload = async () => {
    if (!file || !selectedSubjectData) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject_id", selectedSubjectData.subject_id);
    formData.append("subject_type", selectedSubjectData.subject_type);

    try {
      const res = await fetch(`${BACKEND_URL}/api/elective`, {
        method: "POST",
        headers: {
          authorization: token,
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Upload failed");

      toast.success("Elective data uploaded successfully!");
      setFileInputKey(Date.now());
      setFile(null);
      setSelectedElective("");
    } catch (err) {
      toast.error(err.message);
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
                className="sidebar-0"
                title="HOD Activities"
                activities={[
                  {
                    name: "View Department Details",
                    path: "/hod/department-details",
                  },
                  {
                    name: "Registration Requests",
                    path: "/hod/registration-request",
                  },
                  {
                    name: "Faculty Allocation",
                    path: "/hod/faculty-allocation",
                  },
                  {
                    name: "Upload Electives Data",
                    path: "/hod/elective-data",
                  },
                ]}
              />
            </div>

            <div className="user-info">
              <div className="user-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/hod-home")}
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
                {/* here */}
                <div className="fac-alloc">
                  <h3>Upload Elective Data </h3>
                  <p className="session-text">
                    Current Session:{" "}
                    {currentSession
                      ? `${currentSession.start_month}/${currentSession.start_year} - ${currentSession.end_month}/${currentSession.end_year}`
                      : "Loading..."}
                  </p>

                  <span className="box-overlay-text">Upload</span>

                  <div className="faculty-box">
                    <p className="institute-text">
                      <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF
                      TECHNOLOGY & SCIENCE
                    </p>

                    <div className="dropdown">
                      <Dropdown
                        label="Elective Subject"
                        options={electiveOptions}
                        selectedValue={selectedElective}
                        onChange={setSelectedElective}
                      />
                    </div>

                    {selectedSubjectData && (
                      <div className="selected-subject-info">
                        <h4>Selected Elective Details:</h4>
                        <p>
                          <strong>Subject ID:</strong>{" "}
                          {selectedSubjectData.subject_id}
                        </p>
                        <p>
                          <strong>Subject Name:</strong>{" "}
                          {selectedSubjectData.subject_name}
                        </p>
                        <p>
                          <strong>Course ID:</strong>{" "}
                          {selectedSubjectData.course_id}
                        </p>
                        <p>
                          <strong>Specialization:</strong>{" "}
                          {selectedSubjectData.specialization}
                        </p>
                        <p>
                          <strong>Semester:</strong>{" "}
                          {selectedSubjectData.semester}
                        </p>
                        <div className="upload-container">
                          <input
                            key={fileInputKey}
                            type="file"
                            accept=".csv"
                            className="file-input"
                            onChange={(e) => setFile(e.target.files[0])}
                          />
                          <button
                            className="upload-button"
                            disabled={!file}
                            onClick={handleUpload}
                          >
                            Upload
                          </button>
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

export default ElectiveDataUpload;
