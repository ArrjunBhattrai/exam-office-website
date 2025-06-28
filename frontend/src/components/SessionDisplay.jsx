import React from "react";
import { useSelector } from "react-redux";

const months = [ 
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SessionDisplay = ({ className = "" }) => {
  const { start_month, start_year, end_month, end_year } = useSelector(
    (state) => state.session
  );

  if (!start_month || !start_year || !end_month || !end_year) {
    return <p className={className}>No current session</p>;
  }

  return (
    <p className={className}>
      Current Session: {months[start_month]} {start_year} -{" "}
      {months[end_month]} {end_year}
    </p>
  );
};


export default SessionDisplay;
