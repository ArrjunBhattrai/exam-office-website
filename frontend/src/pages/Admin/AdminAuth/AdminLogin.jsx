import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import BlueHeader from "../../../components/BlueHeader";
import BlueFooter from "../../../components/BlueFooter";
import "./Auth.css";
import { BACKEND_URL } from "../../../../config";

const generateCaptcha = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [userType, setUserType] = useState("ADMIN"); // Change default to ADMIN
  const [errors, setErrors] = useState({});
  const authState = useSelector((state) => state.auth);

  const { isAuthenticated, userType: userType2 } = useSelector(
    (state) => state.auth
  );

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate(`/${userType2.toLowerCase()}-home`);
  //   }
  // }, [isAuthenticated, userType2, navigate]);

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

    if (
      !errors.email &&
      !errors.captcha &&
      email &&
      password &&
      enteredCaptcha
    ) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            user_type: userType, // Send selected user type
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        const response2 = await fetch(`${BACKEND_URL}/api/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: data.token,
          },
        });

        const data2 = await response2.json();
        console.log(data2);

        dispatch(
          login({
            officer_name: data2.data.officer.officer_name,
            officer_id: data2.data.officer.officer_id,
            email: data2.data.officer.email,
            user_type: data2.data.officer.user_type,
            token: data.token,
          })
        );
        // const val = useSelector((state) => state.auth);
        console.log(val);

        alert("Login Successful!");
        navigate(`/${userType.toLowerCase()}-home`); // Navigate based on user type
      } catch (error) {
        alert(error.message);
      }
    }
  };
  
  const val = useSelector((state) => state.auth);
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
            <div className="input-group">
              <label>User Type:</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                {/* <option value="HOD">HOD</option> */}
                <option value="ADMIN">Admin</option>
                {/* <option value="FACULTY">Faculty</option> */}
              </select>
            </div>

            {/* Email Field */}
            <div className="input-group">
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
            Don't have an account?{" "}
            <Link to="/admin-register">Register here</Link>
          </p>
        </div>
      </div>
      <BlueFooter />
    </div>
  );
};

export default AdminLogin;
