import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "./UserContext";

const ForgotPwdModal = ({ isOpen, onClose }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const { userName, userEmail, setUserEmail } = useUserContext();
  const hosturl = process.env.API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  if (!isOpen) return null;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  function changePasswordApiCall(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const { newPassword, confirmPassword } = formData;
    // Perform form validation
    const errors = {};

    // Password must be at least 6 characters
    if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    // New password and confirm password must match
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length === 0) {
      // If no validation errors, make the API call
      fetch(`${hosturl}/newpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailid: userEmail,
          newPassword: newPassword,
        }),
      })
        .then((response) => {
          if (response.status === 401) {
            // User is not registered
            toast.error("User not registered", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else if (response.status === 200) {
            // Password updated successfully
            onClose();
            navigate("/");
            toast.success("New Password set successfully", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    } else {
      // Display validation errors using toast notifications
      setValidationErrors(errors);
      for (const error of Object.values(errors)) {
        toast.error(error, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }

  return (
    <Fragment>
      <div className="modal-overlay">
        <div className="modal form-section">
          <h2>Change your Password</h2>
          <p>Provide below details to change your password.</p>
          <form onSubmit={changePasswordApiCall}>
            <div className="inputs">
              <label htmlFor="newPassword">
                <i className="fa-solid fa-lock"></i>
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
              <div className="clear"></div>
              <label htmlFor="confirmPassword">
                <i className="fa-solid fa-lock"></i>
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <div className="clear"></div>
              <p>
                Welcome Back..! <b>{userName}</b> to Set up your new password
                here.
              </p>
              <button className="close-button btn" type="submit">
                <i className="fa-solid fa-pencil"></i> Change
              </button>
              <button className="close-button btn" onClick={onClose}>
                <i className="fa-regular fa-circle-xmark"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotPwdModal;
