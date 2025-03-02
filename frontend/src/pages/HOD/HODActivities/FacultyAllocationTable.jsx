import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./HODHome.css";
import Sidebar from "../../../components/Sidebar";
import ActivityHeader from "../../../components/ActivityHeader";
import RedFooter from "../../../components/RedFooter";
import RedHeader from "../../../components/RedHeader";
import Dropdown from "../../../components/Dropdown";
import Button from "../../../components/Button";

const FacultyAllocationTable = () => {
      const user = useSelector((state) => state.auth.user); // Get logged-in user

      const [course, setCourse] = useState("");
      const [branch, setBranch] = useState("");
      const [semester, setSemester] = useState("");
    
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
                  { name: "Faculty Allocation", path: "/hod-fac-alloc" },
                  { name: "Create New Faculty", path: "/" },
                  { name: "Upload Data for Electives", path: "/hod-upload" },
                  { name: "View Correction Requests", path: "/" },
                  { name: "View Department Details", path: "/" }
                ]}
              />

              <Sidebar
                className="sidebar-2"
                title="Form Dashboard"
                activities={[
                  { name: "View Saved Form", path: "/" },
                  { name: "View Filled Form", path: "/" },
                  { name: "Delete Filled Form", path: "/" }
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
                    <h3>Faculty Allocation</h3>
                    <p className="session-text">Current Session: June 2025</p>

                    <span className="box-overlay-text">Assign Faculty</span>

                    <div className="faculty-box">
                     <p className="institute-text">
                        <strong>Institute:</strong> [801] SHRI G.S. INSTITUTE OF TECHNOLOGY & SCIENCE
                     </p>

                     <div className="dropdown-container">
                        <Dropdown 
                            label="Course"
                            options={["BE", "ME", "B.Pharma"]}
                            selectedValue={course}
                            onChange={setCourse}
                        />

                        <Dropdown
                            label="Branch"
                            options={["CSE", "IT", "ECE", "EI"]}
                            selectedValue={branch}
                            onChange={setBranch}
                        />

                        <Dropdown
                            label="Semester"
                            options={["I", "II", "III", "IV", "V", "VI", "VII", "VIII"]}
                            selectedValue={semester}
                            onChange={setSemester}
                        />
                     </div>

                     <table>
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Subject Name</th>
                                <th>Faculty Code</th>
                                <th>Faculty Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(4)].map((_, index) => (
                             <tr key={index}>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                        </tr>
                        ))}
                        </tbody>
                     </table>

                     <Button className="back-btn" text="Back" navigateTo="/hod-fac-alloc" />
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

export default FacultyAllocationTable;