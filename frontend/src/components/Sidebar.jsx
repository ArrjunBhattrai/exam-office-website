import React from "react";
import { useNavigate } from "react-router-dom"; // Removed duplicate `useNvigate`
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import "./comp.css";

const Sidebar = ({ className, title, activities }) => {
  const navigate = useNavigate();

  return (
    <div className={`sidebar ${className}`}>
      <div className="section-title">
        <FontAwesomeIcon icon={faCaretDown} /> 
        <span>{title}</span>
      </div>
      <ul className="menu">
        {activities.map((activity, index) => (
          <li key={index} onClick={() => navigate(activity.path)} style={{ cursor: "pointer" }}>
            {activity.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
