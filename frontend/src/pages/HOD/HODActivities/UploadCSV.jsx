import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./HODHome.css";
import Sidebar from "../../../components/Sidebar";
import ActivityHeader from "../../../components/ActivityHeader";
import RedFooter from "../../../components/RedFooter";
import RedHeader from "../../../components/RedHeader";
import { FaHome, FaSignOutAlt } from "react-icons/fa";


const UploadCSV = () => {
    const user = useSelector((state) => state.auth.user); // Get logged-in user

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
        } else {
            alert("Please upload a valid CSV file.");
            setFile(null);
        }
    };

    const handleUpload = () => {
        if (!file) {
            alert("No file selected!");
            return;
        }
        console.log("Uploading:", file.name);

        /* further processing logic here */
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
                                title="HOD Activity"
                                activities={[
                                    {
                                      name: "View Department Details",
                                      path: "/hod-deptt-details",
                                    },
                                    { name: "Create New Faculty", path: "/hod-new-fac" },
                                    { name: "Faculty Allocation", path: "/hod-fac-alloc" },
                                    { name: "Upload Data for Electives", path: "/hod-upload" },
                                    { name: "Progress Report", path: "/progress-report" },
                                    {
                                      name: "View Correction Requests",
                                      path: "/hod-correction-req",
                                    },
                                  ]}
                            />

                        </div>


                        <div className="hod-info">
                            <div className="hod-sec">
                                <p>
                                    <span>Welcome: </span>
                                    <span className="hod-name">[{user?.name || "Please Login"}]</span>
                                </p>
                                <p>
                                    <span className="hod-role">Role: </span>
                                    <span className="hod-name">[{user?.role || "Please Login"}]</span>
                                </p>
                                <p>
                                    <span className="hod-role">Department: </span>
                                    <span className="hod-name">
                                        [{user?.department || "Please Login"}]
                                    </span>
                                </p>
                            </div>

                            <div className="fac-alloc">
                                <h3>Upload Data for Electives</h3>
                                <p className="session-text">Current Session: June 2025</p>

                                <span className="box-overlay-text">Upload</span>

                                <div className="faculty-box">
                                    <p className="institute-text">
                                        <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF TECHNOLOGY & SCIENCE
                                    </p>


                                    <div className="upload-container">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                            className="file-input"
                                        />
                                        <button onClick={handleUpload} className="upload-button">
                                            Upload CSV
                                        </button>
                                        {file && <p>Selected File: {file.name}</p>}
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>

                    <RedFooter />
                </div>
            </div>
        </div>
    )
}

export default UploadCSV;