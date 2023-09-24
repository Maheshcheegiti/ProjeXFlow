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
  }, [WorkspaceRoute, WorkspaceChatRoute, userEmail, Navigate]);

  const handleLogout = () => {
    // Clear userEmail and other user-related data
    setUserEmail("");
    // You can clear other user-related data (e.g., userName, linkedin, github) here as well

    // Clear localStorage except for the theme
    const savedTheme = localStorage.getItem("theme");
    localStorage.clear();
    localStorage.setItem("theme", savedTheme);

    // Redirect the user to the home page or another appropriate route
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
            <NavLink to="/workspace">
              <li>Workspace</li>
            </NavLink>
            <NavLink to="/aboutus">
              <li>AboutUs</li>
            </NavLink>
            <NavLink to="/contact">
              <li>Contact</li>
            </NavLink>
            {(WorkspaceRoute ||
              WorkspaceChatRoute ||
              (userEmail.length > 0 && AboutRoute) ||
              (userEmail.length > 0 && ContactRoute)) && (
              <Fragment>
                <NavLink to="/">
                  <li onClick={handleLogout}>Logout</li>
                </NavLink>
                <UserProfile />
              </Fragment>
            )}
            {((userEmail.length === 0 && AboutRoute) ||
              (userEmail.length === 0 && ContactRoute)) && (
              <NavLink to="/">
                <li>Login</li>
              </NavLink>
            )}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default Nav;
