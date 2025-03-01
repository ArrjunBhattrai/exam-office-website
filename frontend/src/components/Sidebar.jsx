import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import "./comp.css";

const Sidebar = ({ title, activities }) => {
  return (
    <div className="sidebar">
      <div className="section-title">
        <FontAwesomeIcon icon={faCaretDown} /> 
        <span>{title}</span>
      </div>
      <ul className="menu">
        {activities.map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;