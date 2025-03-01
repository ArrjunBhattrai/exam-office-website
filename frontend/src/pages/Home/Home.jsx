import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import BlueHeader from "../../components/BlueHeader";
import BlueFooter from "../../components/BlueFooter";

const Home = () => {
  return (
    <div className="home-container">
      <BlueHeader />
      <div className="background">
        <div className="overlay"></div> 
        
        <div className="login-card">
          <Link to="/admin-login" className="login-btn-home">
            <FontAwesomeIcon icon={faUser} className="icon" /> 
            <span>Admin Login</span>
          </Link>
          <Link to="/hod-login" className="login-btn-home">
            <FontAwesomeIcon icon={faUser} className="icon" /> 
            <span>HOD Login</span>
          </Link>
          <Link to="/faculty-login" className="login-btn-home">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <span>Faculty Login</span>
          </Link>
        </div>

      </div>
      <BlueFooter />
    </div>
  );
};

export default Home;
