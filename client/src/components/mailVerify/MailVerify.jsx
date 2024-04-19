// MailVerify.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MailVerify.scss";
import { toast } from "react-toastify";
import axios from "axios";

const MailVerify = ({ inputs, setsendOtp }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpChange = (event, index) => {
    const { value } = event.target;
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus on the next input field
      if (value.length === 1 && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8800/api/auth/register",
        { ...inputs, otp: otp.join("") }
      );
      toast.success(data.msg);
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.msg);
    }
    setIsLoading(false);
  };

  return (
    <div className="email-verification-component">
      <h2 className="title">Email Verification</h2>
      <p className="description">
        Please enter the 4-digit OTP sent to your email address.
      </p>
      <div className="otp-input-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="otp-input"
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </div>
      <button className="verify-button" onClick={handleVerifyOtp}>
        Verify OTP
      </button>
      <p className="wrong-email">
        <b>{inputs.email}</b> wrong Email{" "}
        <button
          style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
          onClick={() => setsendOtp(false)}
          className="changeBtn"
        >
          Change Here
        </button>
      </p>
    </div>
  );
};

export default MailVerify;
