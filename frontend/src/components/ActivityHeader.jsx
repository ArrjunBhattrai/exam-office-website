import React from "react";
import "./comp.css";

const ActivityHeader = () => {
  return (

    <header className="a-header">
      <div>
      <img src="/images/gs-logo-2.png" alt="gsits Logo" className="logo" />
      </div>

      
      <svg className="wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"
        transform="rotate(90)">
        <path d="M1000 0H0v52C62.5 28 125 4 250 4c250 0 250 96 500 96 125 0 187.5-24 250-48V0Z" fill="#b38b00"></path>
        </svg>
      
        
      
      <div className="a-header-container">
        
        <div className="a-header-text">
          <h1>SHRI G.S. INSTITUTE OF TECHNOLOGY & SCIENCE</h1>
          <p>23, Park Road, Indore</p>
        </div>
      </div>
    </header>
  );
};

export default ActivityHeader;
