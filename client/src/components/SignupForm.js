import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "./UserContext";

const SignupForm = () => {
  const navigate = useNavigate();

  // State variables to hold validation errors
  const [validationErrors, setValidationErrors] = useState({});
  const { userEmail, userName, linkedin, github } = useUserContext();
  function signupApiCall(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const username = userName;
    const mailid = userEmail;
    const password = document.getElementById("password").value;
    const cpassword = document.getElementById("cpassword").value;
    const linkedIn = linkedin;
    const gitHub = github;
    const terms = document.getElementById("terms").checked;

    // Perform form validation
    const errors = {};

    // Username must be at least 6 characters
    if (username.length < 6) {
      errors.username = "Username must be at least 6 characters";
    }

    // Password must be at least 6 characters and match confirm password
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (password !== cpassword) {
      errors.cpassword = "Passwords do not match";
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mailid)) {
      errors.mailid = "Invalid email format";
    }

    // Validate LinkedIn and GitHub links using regular expressions
    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i;
    if (!linkedIn.match(linkedinRegex)) {
      errors.linkedIn = "Invalid LinkedIn profile link";
    }

    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/.+/i;
    if (!gitHub.match(githubRegex)) {
      errors.gitHub = "Invalid GitHub profile link";
    }

    if (!terms) {
      errors.terms = "You must accept the terms and conditions";
    }

    if (Object.keys(errors).length === 0) {
      // If no validation errors, make the API call
      fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          mailid: mailid,
          password: password,
          linkedin: linkedIn,
          github: gitHub,
          terms: terms,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 400) {
              // User is already registered, show an error toast
              toast.error("🙋🏻‍♂️User is already registered", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              return;
            } else {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
          }
          toast.success("👨🏻‍💻 Successfully Registered!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          // Manually navigate to the desired page after successful signup
          navigate("/workspace");
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
      <div className="form-section signup-form">
        <form onSubmit={signupApiCall}>
          <div className="inputs">
            <div>
              <label htmlFor="username">
                <i className="fa-solid fa-user"></i>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={userName}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="password">
                <i className="fa-solid fa-lock"></i>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="cpassword">
                <i className="fa-solid fa-lock"></i>
              </label>
              <input
                type="password"
                name="cpassword"
                id="cpassword"
                placeholder="Confirm Password"
              />
            </div>
          </div>
          <div className="termsbutton">
            <div className="terms">
              <input type="checkbox" name="terms" id="terms" />
              <label htmlFor="terms">
                I accept{" "}
                <Link to="/termsandconditions">Terms & Conditions</Link>
              </label>
            </div>
            <Link to="/signupnext">
              <button className="btn">GoBack</button>
            </Link>
            <button className="btn" type="submit">
              Signup
            </button>
          </div>
          <div className="underline"></div>
          <div className="signup-text">
            <p>
              Already have an account? Click{" "}
              <Link className="link" to="/">
                here
              </Link>{" "}
              to login
            </p>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default SignupForm;
