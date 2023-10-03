import React, { Fragment } from "react";
import ProjeXFLow from "../images/projexflow.png";

const AboutUs = () => {
  return (
    <Fragment>
      <div className="about-us-container">
        <h1>About ProjeXFlow</h1>
        <div className="about-me">
          <div>
            <h2>Meet the Creator</h2>
            <p>
              <strong>Name:</strong> Cheegiti Mahesh
            </p>
            <p>
              Hello! I am Cheegiti Mahesh, the creator of ProjeXFlow. It's my
              pleasure to introduce you to this project management tool designed
              to streamline collaboration, enhance productivity, and facilitate
              team member tracking.
            </p>
          </div>
          <div className="about-image">
            <img src={ProjeXFLow} alt="ProjeXFlow" />
          </div>
        </div>

        <h2>What is ProjeXFlow?</h2>
        <p>
          <strong>ProjeXFlow</strong> is a powerful project management platform
          created to facilitate efficient teamwork and project coordination.
          It's the result of my dedication to simplifying project management
          processes and providing teams with the tools they need to succeed.
        </p>

        <h2>Key Features</h2>
        <ul>
          <li>
            <strong>Task Assignment:</strong> ProjeXFlow allows project owners
            to assign tasks to their team members easily. This feature ensures
            clear responsibilities and promotes accountability within the group.
          </li>
          <li>
            <strong>Group Chat:</strong> Communication is vital in any project.
            With the integrated chat section, team members can discuss tasks,
            share updates, and collaborate effectively, all within the platform.
          </li>
          <li>
            <strong>Task Tracking:</strong> Keep an eye on the progress of your
            projects with the task tracking feature. Easily monitor the status
            of tasks and ensure they are completed on time.
          </li>
          <li>
            <strong>Team Member Tracking:</strong> ProjeXFlow provides the
            ability to track team members' progress and contributions to the
            project. It helps project owners understand who is doing what and
            how efficiently tasks are being completed.
          </li>
          <li>
            <strong>Customizable Themes:</strong> ProjeXFlow offers both dark
            and light mode options to suit your preferences and enhance user
            experience.
          </li>
          <li>
            <strong>Security:</strong> We take data security seriously. Rest
            assured that your information and project details are kept safe and
            confidential.
          </li>
          <li>
            <strong>Workspace Creation:</strong> Create dedicated workspaces for
            your projects and share them with your team members. It's a seamless
            way to start working together.
          </li>
        </ul>

        <h2>Join the ProjeXFlow Community</h2>
        <p>
          At ProjeXFlow, we believe in the power of teamwork and efficient
          project management. Join our growing community of users and experience
          a platform designed to simplify the way you work on projects. Whether
          you're a small team or a large organization, ProjeXFlow is here to
          help you achieve your project goals.
        </p>

        <p>
          Thank you for choosing ProjeXFlow as your project management tool. We
          look forward to being a part of your successful projects!
        </p>
      </div>
    </Fragment>
  );
};

export default AboutUs;
