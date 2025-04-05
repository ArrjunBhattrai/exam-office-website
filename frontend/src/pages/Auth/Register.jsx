import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import BlueHeader from "../../components/BlueHeader";
import BlueFooter from "../../components/BlueFooter";
import { BACKEND_URL } from "../../../config";
import "./Auth.css";
import { RollerCoaster } from "lucide-react";

const generateCaptcha = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const Register = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [userType, setUserType] = useState("admin"); // Change default to ADMIN
  const [errors, setErrors] = useState({});
  //   const authState = useSelector((state) => state.auth);

  //   const { isAuthenticated, userType: userType2 } = useSelector(
  //     (state) => state.auth
  //   );
  //   const val = useSelector((state) => state.auth);

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

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setEnteredCaptcha("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !errors.email &&
      !errors.captcha &&
      name &&
      email &&
      password &&
      enteredCaptcha
    ) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role: userType }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Registration failed!");

        alert("Registration Successful! Please login.");
        navigate("/login");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleFacultyRequest = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill all required fields.");
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Faculty Placeholder", // or fetch from DB if login-only page
          email,
          password,
          role: "FACULTY",
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed!");
  
      alert("Request submitted! Please wait for HOD/Admin approval.");
    } catch (error) {
      alert(error.message);
    }
  };
  

  return (
    <div className="container">
      <BlueHeader />
      <div className="auth-container">
        <div className="auth-box">
          <h3>Register</h3>
          <form onSubmit={handleSubmit}>
            {/* User Type Dropdown */}
            <div className="input-group-auth">
              <label>User Type:</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="HOD">HOD</option>
                <option value="FACULTY">Faculty</option>
              </select>
            </div>

            {/* Name Field */}
            <div className="input-group-auth">
              <label>Name:</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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

            
              {userType === "FACULTY" ? (
                <button
                  type="submit"
                  className="auth-btn"
                  onClick={handleFacultyRequest}
                >
                  Request Approval
                </button>
              ) : (
                <button type="submit" className="auth-btn">
                  Register
                </button>
              )}
            
          </form>

          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
      <BlueFooter />
    </div>
  );
};

export default Register;
