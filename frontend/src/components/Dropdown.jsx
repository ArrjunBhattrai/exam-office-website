import React, { useState } from "react";
import "./comp.css";

const Dropdown = ({ label, options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown">
        <label>{label}:</label>
        <div className="dropdown-wrapper">
        <select
          value={selectedValue}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
        >
          <option value="" disabled>
            SELECT
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="dropdown-arrow">{isOpen ? "▴" : "▾"}</span>
        </div>
        
    </div>
  );
};

export default Dropdown;