import React, { Fragment, useEffect, useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import ProjeXFLow from "../images/projexflow.png";
import { useUserContext } from "./UserContext";
import { toast } from "react-toastify";
import LoadingScreen from "./LoadingScreen";
import UserProfile from "./UserProfile";

const Nav = () => {
  const [navEffect, setNavEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Initialize isLoading as false
  const Navigate = useNavigate();
  const location = useLocation();
  const { userEmail, setUserEmail } = useUserContext();
  const MainRoute = location.pathname === "/";
  const SignupRoute = location.pathname === "/signup";
  const SignupNextRoute = location.pathname === "/signupnext";
  const WorkspaceRoute = location.pathname === "/workspace";
  const WorkspaceChatRoute = location.pathname === "/workspace/chat";
  const ForgotPasswordRoute = location.pathname === "/forgot_password";
  const AboutRoute = location.pathname === "/aboutus";
  const ContactRoute = location.pathname === "/contact";
  const navClass = navEffect ? "nav nav-effect" : "nav";
  const savedTheme = localStorage.getItem("theme");
  const [isDarkMode, setIsDarkMode] = useState(savedTheme === "dark");
  const [isStopScroll, seIsStopScroll] = useState(false);

  const toggleMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    // Save the theme preference in local storage
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    // Apply the [theme="dark"] attribute to the <html> element based on the saved theme preference
    document.documentElement.setAttribute(
      "theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (isStopScroll) {
        setNavEffect(true);
      } else if (window.scrollY > 20) {
        setNavEffect(true);
      } else {
        setNavEffect(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isStopScroll]);

  useEffect(() => {
    if (WorkspaceRoute || WorkspaceChatRoute) {
      seIsStopScroll(true);
      fetch("http://localhost:5000/checkmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailid: userEmail,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              return;
            } else {
              setUserEmail("");
            }
          } else {
            setUserEmail("");
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setUserEmail("");
        });
      if (userEmail.length === 0) {
        window.scrollTo(0, 0);
        document.body.height = "100vh";
        document.body.style.overflow = "hidden";
        setIsLoading(true); // Set isLoading to true when navigating
        toast.info("Please login or sign up...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Simulate loading for 2 seconds (you can replace this with actual loading logic)
        setTimeout(() => {
          setIsLoading(false); // Set isLoading to false when done loading
          Navigate("/");
        }, 3000);
      }
    } else {
      seIsStopScroll(false);
    }
    // Cleanup function to reset styles when the component unmounts
    return () => {
      document.body.style.height = "auto";
      document.body.style.overflow = "visible";
    };
  }, [WorkspaceRoute, WorkspaceChatRoute, userEmail, Navigate, setUserEmail]);

  useEffect(() => {
    if (AboutRoute || ContactRoute) {
      fetch("http://localhost:5000/checkmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailid: userEmail,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              return;
            } else {
              setUserEmail("");
            }
          } else {
            setUserEmail("");
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setUserEmail("");
        });
    }
  }, [AboutRoute, ContactRoute, setUserEmail, userEmail]);

  const handleLogout = () => {
    setUserEmail("");
    const savedTheme = localStorage.getItem("theme");
    localStorage.clear();
    localStorage.setItem("theme", savedTheme);
    Navigate("/");
  };

  return (
    <Fragment>
      {isLoading && <LoadingScreen />}
      <div className={navClass}>
        <div className="logo">
          <img src={ProjeXFLow} alt="ProjeXFLow" />
          <h1>ProjeXFlow</h1>
        </div>
        <div className="tags">
          <ul>
            <span onClick={toggleMode}>
              <span className="thememode">
                {isDarkMode ? (
                  <i className="fa-regular fa-sun"></i>
                ) : (
                  <i className="fa-regular fa-moon"></i>
                )}
              </span>
            </span>
            <li>
              <NavLink to="/workspace">Workspace</NavLink>
            </li>
            <li>
              <NavLink to="/aboutus">AboutUs</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            {(WorkspaceRoute ||
              WorkspaceChatRoute ||
              (userEmail.length > 0 && AboutRoute) ||
              (userEmail.length > 0 && ContactRoute)) && (
              <Fragment>
                <li onClick={handleLogout}>
                  <NavLink to="/">Logout</NavLink>
                </li>
                <UserProfile />
              </Fragment>
            )}
            {((userEmail.length === 0 && AboutRoute) ||
              (userEmail.length === 0 && ContactRoute) ||
              ForgotPasswordRoute) && (
              <li>
                <NavLink to="/">Login</NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default Nav;
