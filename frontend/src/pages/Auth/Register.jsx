import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import BlueHeader from "../../components/BlueHeader";
import BlueFooter from "../../components/BlueFooter";
import { BACKEND_URL } from "../../../config";
import "./Auth.css";

function generateCaptcha(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Omitted confusing characters
  let captcha = "";
  for (let i = 0; i < length; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}


const Register = () => {
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userId, setuserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [userType, setUserType] = useState("admin");
  const [branchId, setBranchId] = useState("");
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

  // const refreshCaptcha = () => {
  //   setCaptcha(generateCaptcha());
  //   setEnteredCaptcha("");
  // };

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

    if (
      localEmailError ||
      localCaptchaError ||
      !userId ||
      !name ||
      !password ||
      (["hod", "faculty"].includes(userType) && !branchId)
    ) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          name,
          email,
          password,
          role: userType,
          branch_id: branchId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed!");

      if (userType === "faculty") {
        alert("Request submitted! Please wait for HOD/Admin approval.");
      } else {
        alert("Registration Successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      alert(error.message);
    }
  };

/*
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
  */

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
                <option value="hod">HOD</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
            <div className="input-group-auth">
              <label>User Id</label>
              <input
                type="text"
                placeholder="Enter User Id"
                value={userId}
                onChange={(e) => setuserId(e.target.value)}
                required
              />
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
                  if (touched.email) validateEmail(e.target.value);
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  validateEmail(email);
                }}
                required
              />
              {touched.email && errors.email && <span className="error">{errors.email}</span>}
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

            {(userType === "hod" || userType === "faculty") && (
              <div className="input-group-auth">
                <label>Branch ID:</label>
                <input
                  type="text"
                  placeholder="Enter Branch ID"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  required
                />
              </div>
            )}

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
              onBlur={() => {
                setTouched((prev) => ({ ...prev, captcha: true }));
                validateCaptcha(enteredCaptcha);
              }}
              required
            />
            {touched.captcha && errors.captcha && <span className="error">{errors.captcha}</span>}

            {userType === "faculty" ? (
              <button type="submit" className="auth-btn">
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
