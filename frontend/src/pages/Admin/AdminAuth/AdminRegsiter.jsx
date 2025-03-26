import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import BlueHeader from "../../../components/BlueHeader";
import BlueFooter from "../../../components/BlueFooter";
import { BACKEND_URL } from "../../../../config";

const generateCaptcha = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const AdminRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [officer_name, setOfficer_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("ADMIN");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");

  const validateUsername = (value) => {
    let error = "";
    if (/^\d/.test(value)) error = "❌ Username cannot start with a digit.";
    setErrors((prev) => ({ ...prev, officer_name: error }));
  };

  const validatePassword = (value) => {
    let error = "";
    if (value.length < 6) error = "❌ Password must be at least 6 characters.";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
      error = "❌ Must include a special character.";
    else if (!/\d/.test(value)) error = "❌ Must contain at least one digit.";
    setErrors((prev) => ({ ...prev, password: error }));

    if (value.length < 6) setPasswordStrength("Weak ❌");
    else if (/[!@#$%^&*(),.?":{}|<>]/.test(value) && /\d/.test(value))
      setPasswordStrength("Strong ✅");
    else setPasswordStrength("Medium ⚠");
  };

  const validateCaptcha = (value) => {
    let error = value !== captcha ? "❌ Incorrect Captcha!" : "";
    setErrors((prev) => ({ ...prev, captcha: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errors.officer_name && !errors.password && !errors.captcha) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/HODregister`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            officer_name,
            email,
            password,
            user_type: userType,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }
        console.log(data);
        dispatch(register({ officer_name }));
        alert("Registration Successful!");
        navigate("/admin-login");
      } catch (error) {
        alert(error.message);
      }
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
          <h3>Register</h3>
          <form onSubmit={handleSubmit}>

          <div className="input-group">
              <label>User Type:</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                {/* <option value="HOD">HOD</option> */}
                <option value="ADMIN">ADMIN</option>
                {/* <option value="FACULTY">FACULTY</option> */}
              </select>
            </div>
            
            <div className="input-group">
              <label>Username:</label>
              <input
                type="text"
                placeholder="Enter Username"
                value={officer_name}
                onChange={(e) => {
                  setOfficer_name(e.target.value);
                  validateUsername(e.target.value);
                }}
                required
              />
              {errors.officer_name && (
                <span className="error">{errors.officer_name}</span>
              )}
            </div>

            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                required
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
              {password && (
                <span className={`strength ${passwordStrength}`}>
                  {passwordStrength}
                </span>
              )}
            </div>

            <button type="submit" className="auth-btn">
              Register
            </button>
          </form>
          <p>
            Already have an account? <Link to="/admin-login">Login here</Link>
          </p>
        </div>
      </div>
      <BlueFooter />
    </div>
  );
};

export default AdminRegister;
