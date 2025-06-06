import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import BlueHeader from "../../components/BlueHeader";
import BlueFooter from "../../components/BlueFooter";
import { BACKEND_URL } from "../../../config";
import Button from "../../components/Button";
import "./Auth.css";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("SELECT");
  const [touched, setTouched] = useState({
    email: false,
  });
  const [errors, setErrors] = useState({});
  const [isCooldown, setIsCooldown] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [linkSent, setLinkSent] = useState(false);

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

  useEffect(() => {
    let interval;
    if (isCooldown && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (secondsLeft === 0) setIsCooldown(false);

    return () => clearInterval(interval);
  }, [isCooldown, secondsLeft]);

  const handleSubmit = async () => {
    console.log("hi");
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    if (userType === "SELECT") {
      toast.error("Please select a user type.");
      return;
    }

    if (isCooldown) {
      toast.error("⏳ Please wait before sending another request.");
      return;
    }

    const localEmailError =
      !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "❌ Invalid email format."
        : "";

    if (!localEmailError) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/user/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, role: userType }),
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.error || "Something went wrong, please try again later."
          );

        toast.success("Reset link sent to your email.");
        setLinkSent(true);
        setIsCooldown(true);
        setSecondsLeft(60);
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const isButtonDisabled =
    !email || userType === "SELECT" || !!errors.email || isCooldown;

  return (
    <div className="container">
      <BlueHeader />
      <div className="auth-container">
        <div className="auth-box">
          <h3>Forgot Password</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            {/* User Type Dropdown */}
            <div className="input-group-auth">
              <label>User Type:</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="SELECT">Select</option>
                <option value="admin">Admin</option>
                <option value="hod">HOD</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
            {/* Email Input */}
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
          </form>
          {/* Send / Resend Link Button */}
          <Button
            text={linkSent ? "Resend Link" : "Send Link"}
            onClick={handleSubmit}
            className={isButtonDisabled ? "disabled-style" : ""}
          />

          {/* Timer Message */}
          {isCooldown && (
            <div style={{ marginTop: "10px", color: "#555", fontSize: "14px" }}>
              ⏳ Please wait {secondsLeft} seconds before requesting again.
            </div>
          )}
        </div>
      </div>

      <BlueFooter />
    </div>
  );
};

export default ForgotPass;
