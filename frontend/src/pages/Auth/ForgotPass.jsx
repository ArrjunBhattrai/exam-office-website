import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import BlueHeader from "../../components/BlueHeader";
import BlueFooter from "../../components/BlueFooter";
import { BACKEND_URL } from "../../../config";
import Button from "../../components/Button";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("SELECT");
  const [touched, setTouched] = useState({
      email: false,
    });
    const [errors, setErrors] = useState({});


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

  const handleSubmit = async () => {
    if (!email) return toast.error("Please enter your email.");

    const localEmailError =
      !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "❌ Invalid email format."
        : "";

    if (!localEmailError) {
      try {
        const res = await fetch(`${BACKEND_URL}/user/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        toast.success("Reset link sent to your email.");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="container">
      <BlueHeader />
      <div className="forgot-pass">
        <div className="auth-box">
    <h2>Forgot Password</h2>
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
        </div>
        

        <Button text="Send Link" onClick={handleSubmit} />
      </div>

      <BlueFooter />
    </div>
  );
};

export default ForgotPass;
