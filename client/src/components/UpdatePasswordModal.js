import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "./UserContext";

const UpdatePasswordModal = ({ isOpen, onClose }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const { userName, userEmail } = useUserContext();

  const [formData, setFormData] = useState({
    currentPassword: "",
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
    const { currentPassword, newPassword, confirmPassword } = formData;
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
      fetch("http://localhost:5000/changepassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailid: userEmail,
          currentPassword: currentPassword,
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
          } else if (response.status === 402) {
            // Invalid credentials
            toast.error("Invalid credentials", {
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
            toast.success("Password updated successfully", {
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
          <form>
            <div className="inputs">
              <label htmlFor="currentPassword">
                <i className="fa-solid fa-lock"></i>
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                placeholder="Current Password"
                value={formData.currentPassword}
                onChange={handleInputChange}
              />
              <div className="clear"></div>
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
                {userName} to update password fill the above fields with current
                and new password
              </p>
            </div>
          </form>
          <button
            className="close-button btn"
            type="submit"
            onClick={changePasswordApiCall}
          >
            <i className="fa-solid fa-pencil"></i> Change
          </button>
          <button className="close-button btn" onClick={onClose}>
            <i className="fa-regular fa-circle-xmark"></i> Cancel
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdatePasswordModal;
