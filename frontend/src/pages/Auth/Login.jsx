import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import BlueHeader from "../../components/BlueHeader";
import BlueFooter from "../../components/BlueFooter";
import { BACKEND_URL } from "../../../config";
import "./Auth.css";

function generateCaptcha(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; 
  let captcha = "";
  for (let i = 0; i < length; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const location = useLocation();
  const defaultRole = location.state?.role || "admin";
  const [userType, setUserType] = useState(defaultRole);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    email: false,
    captcha: false,
  });

  const validateEmail = (value) => {
    if (!touched.email) return;

    let error = "";
    if (!value) {
      error = "";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "❌ Invalid email format.";
    }
    setErrors((prev) => ({ ...prev, email: error }));
  };
  useEffect(() => {
    if (touched.email) validateEmail(email);
  }, [email, touched.email]);

  const validateCaptcha = (value) => {
    if (!touched.captcha) return;
    let error = "";
    if (!value) {
      error = "";
    } else if (value !== captcha) {
      error = "❌ Incorrect Captcha!";
    }
    setErrors((prev) => ({ ...prev, captcha: error }));
  };
  useEffect(() => {
    if (touched.captcha) validateCaptcha(enteredCaptcha);
  }, [enteredCaptcha, captcha, touched.captcha]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true, captcha: true });

    const localEmailError =
      !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "❌ Invalid email format."
        : "";
    const localCaptchaError =
      !enteredCaptcha || enteredCaptcha !== captcha
        ? "❌ Incorrect Captcha!"
        : "";

    setErrors({
      email: localEmailError,
      captcha: localCaptchaError,
    });

    if (!localEmailError && !localCaptchaError && password) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role: userType }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Login failed");

        dispatch(
          login({
            userId: data.userId,
            email,
            role: data.role,
            branchId: data.branchId,
            token: data.token,
          })
        );

        alert("Login Successful!");
        navigate(`/${data.role.toLowerCase()}/home`);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const captchaCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = captchaCanvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random()})`;
      ctx.stroke();
    }

    ctx.font = "25px Arial";
    ctx.fillStyle = "#000";
    ctx.Baseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(captcha, canvas.width / 2, canvas.height / 2);
  }, [captcha]);

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
                  if (touched.email) validateEmail(e.target.value);
                }}
                onBlur={(e) => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  validateEmail(e.target.value);
                }}
                required
              />
              {touched.email && errors.email && (
                <span className="error">{errors.email}</span>
              )}
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
              
              <canvas ref={captchaCanvasRef} width={150} height={50} />
              {/* <button onClick={generateCaptcha} style={{ marginLeft: "8px" }}>
                🔄
              </button> */}
            </div>
            <input
              type="text"
              placeholder="Enter Captcha"
              value={enteredCaptcha}
              onChange={(e) => {
                setEnteredCaptcha(e.target.value);
                if (touched.captcha) validateCaptcha(e.target.value);
              }}
              onBlur={(e) => {
                setTouched((prev) => ({ ...prev, captcha: true }));
                validateCaptcha(e.target.value);
              }}
              required
            />
            {touched.captcha && errors.captcha && (
              <span className="error">{errors.captcha}</span>
            )}

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
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
      <BlueFooter />
    </div>
  );
};

export default Login;
