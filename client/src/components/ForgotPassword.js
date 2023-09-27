import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  const handleSendClick = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid email format");
        return;
      }
      setLoading(true); // Set loading to true when sending the request

      const response = await fetch("http://localhost:5000/sendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mailid: email }),
      });

      if (response.ok) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false); // Set loading to false when the request is complete
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      // If OTP has not been sent, do nothing or show an error message
      return;
    }

    const otpValue = document.getElementById("otp").value;

    try {
      const response = await fetch("http://localhost:5000/checkotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mailid: email, otp: otpValue }),
      });

      if (response.ok) {
        // If OTP is valid, show a success message using toast
        toast.success("OTP is valid. You can proceed to reset your password.");
        // You can add code here to navigate to the password reset page
      } else {
        const errorData = await response.json();
        toast.error(errorData.error);
      }
    } catch (error) {
      console.error("Error checking OTP:", error);
      toast.error("Failed to check OTP. Please try again.");
    }
  };

  return (
    <Fragment>
      <div className="form-section">
        <form onSubmit={handleFormSubmit}>
          <div className="inputs">
            <label htmlFor="mailid">
              <i className="fa-solid fa-envelope"></i>
            </label>
            <input
              type="email"
              name="mailid"
              id="mailid"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="clear"></div>
            <div className="signup-text forgot-msg">
              {loading ? ( // Display loading message or spinner while loading
                <p>
                  <span className="circle-span"></span> Sending OTP...
                </p>
              ) : otpSent ? (
                <p className="ws-success">Successfully OTP was sent</p>
              ) : (
                <p>Click the "Send" button to receive an OTP in your email.</p>
              )}
            </div>
            <label htmlFor="otp" className={!otpSent && "disabled"}>
              <i className="fa-solid fa-envelope-open"></i>
            </label>
            <input
              type="text"
              name="otp"
              id="otp"
              placeholder="Enter OTP"
              disabled={!otpSent}
            />
          </div>
          <div className="clear"></div>
          {otpSent ? (
            <button className="btn" type="submit">
              Confirm
            </button>
          ) : (
            <button
              className="btn"
              type="button"
              onClick={handleSendClick}
              disabled={loading} // Disable the button while loading
            >
              {loading ? "Sending..." : "Send"}
            </button>
          )}
          {otpSent ? (
            <button className="btn" type="button" onClick={handleSendClick}>
              Resend
            </button>
          ) : (
            <Link to="/">
              <button className="btn">Back</button>
            </Link>
          )}
          <div className="underline"></div>
          <div className="signup-text">
            <p>
              If you wish to create a new account,{" "}
              <Link className="link" to="/signupnext">
                {" "}
                click here
              </Link>{" "}
              to proceed with the signup process.
            </p>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;