import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "./UserContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { userEmail, setUserEmail, setUserName } = useUserContext();
  // State variables to hold validation errors
  const [validationErrors, setValidationErrors] = useState({});

  function loginApiCall(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const mailid = document.getElementById("mailid").value;
    const password = document.getElementById("password").value;

    // Perform form validation
    const errors = {};

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mailid)) {
      errors.mailid = "Invalid email format";
    }

    // Password must be at least 6 characters
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length === 0) {
      // If no validation errors, make the API call
      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailid: mailid,
          password: password,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 402) {
              // Password mismatch, show an error toast
              toast.error("Password mismatch. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            } else if (response.status === 401) {
              toast.error("User is not registered..!", {
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
          } else {
            // If login is successful, parse the response as JSON
            return response.json();
          }
        })
        .then((data) => {
          // Check if the response contains a 'username' field
          if (data && data.username) {
            toast.success("Login successful!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });

            // Manually navigate to the desired page after successful login
            setUserEmail(mailid);
            setUserName(data.username); // Set the 'username' from the response
            navigate("/workspace");
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
      <div className="form-section">
        <form onSubmit={loginApiCall}>
          <div className="inputs">
            <label htmlFor="mailid">
              <i className="fa-solid fa-envelope"></i>
            </label>
            <input type="email" name="mailid" id="mailid" placeholder="Email" />
            <div className="clear"></div>
            <label htmlFor="password">
              <i className="fa-solid fa-lock"></i>
            </label>
            <input
              type="text"
              name="password"
              id="password"
              placeholder="Password"
            />
          </div>
          <Link to="forgot_password" className="forgot-link">
            Forgot your password?
          </Link>
          <div className="clear"></div>
          <button className="btn" type="submit">
            Login
          </button>
          <Link to="/signupnext">
            <button className="btn">Signup</button>
          </Link>
          <div className="underline"></div>
          <div className="signup-text">
            <p>
              Dont have an account click on the signup button to create account
            </p>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default LoginForm;
