import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Removed duplicate `useNvigate`
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faBars } from "@fortawesome/free-solid-svg-icons";
import "./comp.css";

const Sidebar = ({ className, title, activities }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 1024);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleResize = () => {
    const mobileView = window.innerWidth <= 1024;
    setIsMobile(mobileView);
    setIsCollapsed(mobileView);
    setShowDropdown(false);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if(isMobile) setIsCollapsed(!isCollapsed);
  };

  const toggleDropdown = () => {
    if(!isMobile && isCollapsed) {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <div className={`sidebar ${className} ${isCollapsed ? "collapsed" : ""}`}>
      {isMobile && (
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} /> {title}
          </button>
        </div>
      )}
      {!isMobile && !isCollapsed && (
      <div className="sidebar-title">
        <h3>{title}</h3>
      </div>
    )}
      <ul className={`menu ${isCollapsed ? (showDropdown ? "show" : "hide") : ""}`}>
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
