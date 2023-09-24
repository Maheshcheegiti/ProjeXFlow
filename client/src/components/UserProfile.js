import React, { Fragment } from "react";
import { useUserContext } from "./UserContext";

const UserProfile = () => {
  const { userEmail, userName, linkedin, github } = useUserContext();
  return (
    <Fragment>
      <div>{userName}</div>
      <div>{userEmail}</div>
      <div>{linkedin}</div>
      <div>{github}</div>
    </Fragment>
  );
};

export default UserProfile;
