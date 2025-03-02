import React from "react";
import { useNavigate } from "react-router-dom";
import "./comp.css";

const Button = ({ text, navigateTo }) => {
  const navigate = useNavigate();

  return (
    <button className="custom-button" onClick={() => navigate(navigateTo)}>
      {text}
    </button>
  );
};

export default Button;
