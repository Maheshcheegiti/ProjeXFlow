import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "./UserContext";
import { useEventTrigger } from "./EventTriggerContext";

const UpdateGithubModal = ({ isOpen, onClose }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const { userName, userEmail, github, setGithub } = useUserContext();
  const { wsTrigger, setWSTrigger, teamTrigger, setTeamTrigger } =
    useEventTrigger();

  const [formData, setFormData] = useState({
    github: "",
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

  function changeGithubApiCall(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const { github, password } = formData;
    // Perform form validation
    const errors = {};

    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/.+/i;
    if (!github.match(githubRegex)) {
      errors.github = "Invalid GitHub profile link";
    }

    // Password must be at least 6 characters
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length === 0) {
      // If no validation errors, make the API call
      fetch("http://localhost:5000/changegithub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailid: userEmail,
          password: password,
          newGitHub: github,
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
            // GitHub URL updated successfully
            setGithub(github);
            setWSTrigger(!wsTrigger);
            setTeamTrigger(!teamTrigger);
            onClose();
            toast.success("GitHub URL updated successfully", {
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
          <h2>Change your GitHub URL</h2>
          <p>Provide below details to change your GitHub URL.</p>
          <form>
            <div className="inputs">
              <label htmlFor="github">
                <i class="fa-brands fa-github"></i>
              </label>
              <input
                type="text"
                name="github"
                id="github"
                placeholder={github}
                value={formData.github}
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
            </div>
          </form>
          <p>
            {userName} to change your GitHub URL, please enter your new desired
            GitHub URL and your current password.
          </p>
          <button
            className="close-button btn"
            type="submit"
            onClick={changeGithubApiCall}
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

export default UpdateGithubModal;
