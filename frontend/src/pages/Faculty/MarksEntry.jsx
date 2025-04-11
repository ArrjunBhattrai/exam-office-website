import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button"; // Your button component
import "./faculty.css";
import BlueHeader from "../../components/BlueHeader";
import BlueFooter from "../../components/BlueFooter";

function MarksEntry() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data passed from MarksFeed
  const { subject, component, test, maxMarks } = location.state || {};

  const coKeys = Object.keys(maxMarks || {}); // ["CO1", "CO2", ...]
//   const totalMaxMarks = coKeys.reduce((sum, co) => sum + Number(maxMarks[co] || 0), 0);

  // Sample student data
  const students = [
    { id: 1, enrollment: "0801IT221017", name: "Arjun Bhattrai" },
    { id: 2, enrollment: "0801IT221022", name: "Ananya Joshi" },
    { id: 3, enrollment: "0801IT221030", name: "Dipesh Prajapat" },
    { id: 4, enrollment: "0801IT221082", name: "Laxita Thakur" },
    { id: 5, enrollment: "0801IT221090", name: "Sumit Khandekar" },
  ];

  const [marksData, setMarksData] = useState(
    students.reduce((acc, student) => {
        acc[student.id] = coKeys.reduce((coAcc, co) => {
          coAcc[co] = "";
          return coAcc;
        }, {});
        return acc;
      }, {})
    );

  const handleMarksChange = (studentId, value) => {
    if (
      value === "A" || // Allow 'A' for absent
      (value !== "" && !isNaN(value) && Number(value) <= Number(maxMarks))
    ) {
      setMarksData((prev) => ({ ...prev, [studentId]: value }));
    }
  };

  const calculateTotalMarks = (studentId) => {
    return coKeys.reduce((sum, co) => {
      const val = marksData[studentId]?.[co];
      return sum + (isNaN(val) || val === "A" ? 0 : Number(val));
    }, 0);
  };

  return (
    <div className="container">
      <BlueHeader />
      <div className="marks-entry-container">
        <h2>Marks Entry</h2>

        <div className="info-box">
          <p>
            <strong>Subject:</strong> {subject}
          </p>
          <p>
            <strong>Component:</strong> {component}
          </p>
          <p>
            <strong>Test:</strong> {test}
          </p>
          <p>
            <strong>Max Marks:</strong> {maxMarks}
          </p>
        </div>

        <div className="marks-table">
          <table>
            <thead>
              <tr>
                <th>S. No</th>
                <th>Enrollment No.</th>
                <th>Name</th>
                {coKeys.map((co) => (
                  <th key={co}>{co} (Max: {maxMarks[co]})</th>
                ))}
                <th>Total Marks</th>
              </tr>
            </thead>
            <tbody>
            {students.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.enrollment}</td>
                  <td>{student.name}</td>
                  {coKeys.map((co) => (
                    <td key={co}>
                      <input
                        type="text"
                        value={marksData[student.id]?.[co] || ""}
                        onChange={(e) => handleMarksChange(student.id, co, e.target.value)}
                        placeholder={`Max: ${maxMarks[co]}`}
                      />
                    </td>
                  ))}
                  <td>{calculateTotalMarks(student.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="button-container">
          <Button text="Go Back" navigateTo="/fac-marks-feed" />
          <Button text="Save Marks" onClick={() => alert("Marks Saved!")} />
        </div>
        
      </div>
      <BlueFooter />
      
    </div>
  );
}

export default MarksEntry;
