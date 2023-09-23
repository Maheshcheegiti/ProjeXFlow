import React, { Fragment } from "react";
import Cloud from "../images/cloud.png";
import Project from "../images/project_management.png";
import SmallCloud from "../images/smallcloud.png";
import { Outlet } from "react-router-dom";

const LoginMain = () => {
  return (
    <Fragment>
      <div className="login-main ">
        <div className="image-section">
          <div className="image">
            <img src={Cloud} alt="Cloud" />
          </div>
          <div className="project-image">
            <img src={Project} alt="Project Management" />
          </div>
          <div className="image small-image">
            <img src={SmallCloud} alt="Small Cloud" />
          </div>
          <div className="image small-image small-image2">
            <img src={SmallCloud} alt="Small Cloud" />
          </div>
        </div>
        <Outlet />
      </div>
    </Fragment>
  );
};

export default LoginMain;
