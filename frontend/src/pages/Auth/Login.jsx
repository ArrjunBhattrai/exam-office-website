import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import BlueHeader from "../../components/BlueHeader";
import BlueFooter from "../../components/BlueFooter";
import { BACKEND_URL } from "../../../config";
import "./Auth.css";

const generateCaptcha = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [userType, setUserType] = useState("admin"); // Change default to ADMIN
  const [errors, setErrors] = useState({});
  const authState = useSelector((state) => state.auth);

  const val = useSelector((state) => state.auth);

  const validateEmail = (value) => {
    let error = "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "❌ Invalid email format.";
    }
    setErrors((prev) => ({ ...prev, email: error }));
  };

  const validateCaptcha = (value) => {
    let error = value !== captcha ? "❌ Incorrect Captcha!" : "";
    setErrors((prev) => ({ ...prev, captcha: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!errors.email && !errors.captcha && email && password && enteredCaptcha) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role: userType }),
        });
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Login failed");
        console.log("Login Response:", data);
        // Dispatch user login action with userId, role, and token
        dispatch(
          login({
            userId: data.userId, 
            email,
            role: data.role, 
            token: data.token,
          })
        );
  
        alert("Login Successful!");
        navigate(`/${data.role.toLowerCase()}-home`); // Navigate based on role
      } catch (error) {
        alert(error.message);
      }
    }
  };
  
  console.log(val);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setEnteredCaptcha("");
  };

  return (
    <div className="container">
      <BlueHeader />
      <div className="auth-container">
        <div className="auth-box">
          <h3>Login</h3>
          <form onSubmit={handleSubmit}>
            {/* User Type Dropdown */}
            <div className="input-group-auth">
              <label>User Type:</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="hod">HOD</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>

            {/* Email Field */}
            <div className="input-group-auth">
              <label>Email:</label>
              <input
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="input-group-auth">
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

            {/* Login Button */}
            <button
              type="submit"
              className="auth-btn"
              disabled={
                !!errors.email ||
                !!errors.captcha ||
                !email ||
                !password ||
                !enteredCaptcha
              }
            >
              Login
            </button>
          </form>

          <p className="forgot-password">
            <Link to="/login/forgot-pass">Forgot Password?</Link>
          </p>
          <p>
            Don't have an account?{" "}
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
      <BlueFooter />
    </div>
  );
};

export default Login;
