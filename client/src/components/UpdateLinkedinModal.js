import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "./UserContext";
import { useEventTrigger } from "./EventTriggerContext";

const UpdateLinkedinModal = ({ isOpen, onClose }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const { userName, userEmail, linkedin, setLinkedin } = useUserContext();
  const { wsTrigger, setWSTrigger, teamTrigger, setTeamTrigger } =
    useEventTrigger();

  const [formData, setFormData] = useState({
    linkedin: "",
    password: "",
  });
  if (!isOpen) return null;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function changeLinkedinApiCall(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const { linkedin, password } = formData;
    // Perform form validation
    const errors = {};

    // Validate LinkedIn and GitHub links using regular expressions
    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i;
    if (!linkedin.match(linkedinRegex)) {
      errors.linkedin = "Invalid LinkedIn profile link";
    }
    // Password must be at least 6 characters
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length === 0) {
      // If no validation errors, make the API call
      fetch("http://localhost:5000/changelinkedin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailid: userEmail,
          password: password,
          newLinkedIn: linkedin,
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
            // LinkedIn URL updated successfully
            setLinkedin(linkedin);
            setWSTrigger(!wsTrigger);
            setTeamTrigger(!teamTrigger);
            onClose();
            toast.success("LinkedIn URL updated successfully", {
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
          <h2>Change your LinkedIn URL</h2>
          <p>Provide below details to change your LinkedIn URL.</p>
          <form onSubmit={changeLinkedinApiCall}>
            <div className="inputs">
              <label htmlFor="linkedin">
                <i className="fa-brands fa-linkedin"></i>
              </label>
              <input
                type="text"
                name="linkedin"
                id="linkedin"
                placeholder={linkedin}
                value={formData.linkedin}
                onChange={handleInputChange}
              />
              <div className="clear"></div>
              <label htmlFor="password">
                <i className="fa-solid fa-lock"></i>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <div className="clear"></div>
              <p>
                {userName} to change your LinkedIn URL, please enter your new
                LinkedIn URL and your current password.
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

export default UpdateLinkedinModal;
