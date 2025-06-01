import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BlueHeader from "../../components/BlueHeader";
import BlueFooter from "../../components/BlueFooter";
import { BACKEND_URL } from "../../../config";
import Button from "../../components/Button";

const ResetPass = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    if (!newPassword) return toast.error("Enter a new password.");

    try {
      const res = await fetch(`${BACKEND_URL}/api/user/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Password reset successful.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container">
      <BlueHeader />
      <div className="auth-container">
        <div className="auth-box">
          <div className="forgot-pass">
            <h3>Reset Password</h3>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Button text="Reset Password" onClick={handleReset} />
          </div>
        </div>
      </div>

      <BlueFooter />
    </div>
  );
};

export default ResetPass;
