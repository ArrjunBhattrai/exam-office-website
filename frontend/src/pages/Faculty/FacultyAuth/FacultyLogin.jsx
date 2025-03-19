import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/authSlice";
import { Link } from "react-router-dom";
import BlueHeader from "../../../components/BlueHeader";
import BlueFooter from "../../../components/BlueFooter";
import "./Auth.css";

const generateCaptcha = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const FacultyLogin = () => {
  const dispatch = useDispatch();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [errors, setErrors] = useState({});

  const validateUsername = (value) => {
    let error = "";
    if (/^\d/.test(value)) error = "❌ Username cannot start with a digit.";
    setErrors((prev) => ({ ...prev, username: error }));
  };

  const validateCaptcha = (value) => {
    let error = value !== captcha ? "❌ Incorrect Captcha!" : "";
    setErrors((prev) => ({ ...prev, captcha: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!errors.username && !errors.captcha) {
      dispatch(login({ username }));
      alert("Login Successful!");
    }
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setEnteredCaptcha("");
  };

  return (
    <div className="container">
      <BlueHeader />
      <div className="auth-container">
        <div className="auth-box">
          <h3>FACULTY Login</h3>
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="input-group">
              <label>Username:</label>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateUsername(e.target.value);
                }}
                required
              />
              {errors.username && (
                <span className="error">{errors.username}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Captcha Field */}
            <div className="captcha-box">
              <span className="captcha-text">{captcha}</span>
              <button
                type="button"
                className="refresh-btn"
                onClick={refreshCaptcha}
              >
                🔄
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter Captcha"
              value={enteredCaptcha}
              onChange={(e) => {
                setEnteredCaptcha(e.target.value);
                validateCaptcha(e.target.value);
              }}
              required
            />
            {errors.captcha && <span className="error">{errors.captcha}</span>}
            <br/>
            {/* Login Button */}
            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          <p className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
          <p>
            Don't have an account? <Link to="/faculty-register">Register here</Link>
          </p>
        </div>
      </div>
      <BlueFooter />
    </div>
  );
};

export default FacultyLogin;
