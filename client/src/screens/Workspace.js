import React, { Fragment } from "react";
import WorkspaceBar from "../components/WorkspaceBar";
import { Outlet } from "react-router-dom";
const Workspace = () => {
  return (
    <Fragment>
      <div className="ws-main">
        <WorkspaceBar></WorkspaceBar>
        <Outlet></Outlet>
      </div>
    </Fragment>
  );
};

export default Workspace;
