import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPwdModal from "./ForgotPwdModal";
import { useUserContext } from "./UserContext";

const ForgotPassword = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFpwdModalOpen, setFpwdModalOpen] = useState(false);
  const { setUserName, setUserEmail } = useUserContext();

  const handleSendClick = async () => {
    setOtpSent(false);
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
    if (otpValue.length !== 6) {
      toast.error("OTP must be 6 digits only");
      return;
    }

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
        fetch("http://localhost:5000/checkmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mailid: email,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              if (response.status === 401) {
                return response.json();
              }
            }
          })
          .then((data) => {
            setUserName(data.username);
            setUserEmail(email);
          });
        openFpwdModal();
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

  const openFpwdModal = () => {
    setFpwdModalOpen(true);
  };
  const handleLogout = () => {
    setUserEmail("");
    const savedTheme = localStorage.getItem("theme");
    localStorage.clear();
    localStorage.setItem("theme", savedTheme);
  };
  const closeFpwdModal = () => {
    setFpwdModalOpen(false);
    setOtpSent(false);
    handleLogout();
  };
  useEffect(() => {
    let timerId;
    if (otpSent) {
      timerId = setTimeout(() => {
        if (isFpwdModalOpen) {
          closeFpwdModal();
          toast.error("OTP has Expired");
        }
      }, 300000);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [otpSent, isFpwdModalOpen, closeFpwdModal]);

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
      <div>
        <ForgotPwdModal
          isOpen={isFpwdModalOpen}
          onClose={closeFpwdModal}
        ></ForgotPwdModal>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;
