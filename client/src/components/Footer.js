import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import ProjeXFlow from "../images/projexflow.png";

const Footer = () => {
  return (
    <Fragment>
      <div className="footer">
        <div className="footer-logo">
          <img src={ProjeXFlow} alt="ProjeXFlow" />
          <h1>ProjeXFlow</h1>
        </div>
        <div className="footer-tags">
          <ul>
            <Link to="/workspace">
              <li>Workspace</li>
            </Link>
            <Link to="/aboutus">
              <li>AboutUs</li>
            </Link>
            <Link to="/contact">
              <li>Contact</li>
            </Link>
          </ul>
        </div>
        <div className="footer-about">
          <p>
            Stay Informed about ProjeXFlow Updates and Announcements by
            Following Us on Social Media.
          </p>
          <div className="social-icons">
            <ul>
              <a
                href="https://www.facebook.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <li>
                  <i className="fa-brands fa-facebook"></i>
                </li>
              </a>
              <a
                href="https://www.instagram.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <li>
                  <i className="fa-brands fa-instagram"></i>
                </li>
              </a>
              <a
                href="https://www.x.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <li>
                  <i className="fa-brands fa-x-twitter"></i>
                </li>
              </a>
              <a
                href="https://www.linkedin.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <li>
                  <i className="fa-brands fa-linkedin"></i>
                </li>
              </a>
            </ul>
          </div>
          <p className="copyright">
            &copy; copyright |
            <a
              href="https://www.linkedin.com/in/cheegitimahesh"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              Mahesh Cheegiti{" "}
            </a>
            | <span className="side-effect">2023</span>
          </p>
        </div>
      </div>
    </Fragment>
  );
};

export default Footer;
