import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "./UserContext";

const SignUpNext = () => {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const { setUserEmail, setUserName, setLinkedin, setGithub } =
    useUserContext();

  function signupNextCall(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const username = document.getElementById("username").value;
    const mailid = document.getElementById("mailid").value;
    const linkedin = document.getElementById("linkedin").value;
    const github = document.getElementById("github").value;

    // Perform form validation
    const errors = {};

    // Username must be at least 6 characters
    if (username.length < 6) {
      errors.username = "Username must be at least 6 characters";
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mailid)) {
      errors.mailid = "Invalid email format";
    }

    // Validate LinkedIn and GitHub links using regular expressions
    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i;
    if (!linkedin.match(linkedinRegex)) {
      errors.linkedin = "Invalid LinkedIn profile link";
    }

    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/.+/i;
    if (!github.match(githubRegex)) {
      errors.github = "Invalid GitHub profile link";
    }

    if (Object.keys(errors).length === 0) {
      // If no validation errors, make the next call
      fetch("http://localhost:5000/checkmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailid: mailid,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              // User is already registered, show an error toast
              toast.error("🙋🏻‍♂️User is already Exists", {
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
          setUserEmail(mailid);
          setUserName(username);
          setLinkedin(linkedin);
          setGithub(github);
          // Manually navigate to the desired page after successful signup
          navigate("/signup");
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
        <form onSubmit={signupNextCall}>
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
              />
            </div>
            <div>
              <label htmlFor="mailid">
                <i className="fa-solid fa-envelope"></i>
              </label>
              <input
                type="email"
                name="mailid"
                id="mailid"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="linkedin">
                <i className="fa-brands fa-linkedin"></i>
              </label>
              <input
                type="text"
                name="linkedin"
                id="linkedin"
                placeholder="LinkedIn Profile (e.g., https://www.linkedin.com/in/yourname)"
              />
            </div>
            <div>
              <label htmlFor="github">
                <i className="fa-brands fa-github"></i>
              </label>
              <input
                type="text"
                name="github"
                id="github"
                placeholder="GitHub Profile (e.g., https://github.com/yourusername)"
              />
            </div>
          </div>
          <div className="next">
            <button className="btn sign-btn" type="submit">
              Next
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

export default SignUpNext;
