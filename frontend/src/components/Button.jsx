import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./comp.css";

const Button = ({ text, navigateTo, state, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); 
    }
    if (navigateTo) {
      navigate(navigateTo, { state });
    }
  };

  return (
    <button className="custom-button" onClick={handleClick}>
      {text}
    </button>
  );
};

export default Button;
