import React from "react";
import { useSelector } from "react-redux";

const months = [ 
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SessionDisplay = ({ className = "" }) => {
  const currentSession = useSelector((state) => state.session.currentSession);

  return (
    <p className={className}>
      Current Session:{" "}
      {currentSession
        ? `${months[currentSession.start_month]} ${currentSession.start_year} - ${months[currentSession.end_month]} ${currentSession.end_year}`
        : "Loading..."}
    </p>
  );
};

export default SessionDisplay;
