import React, { Fragment, useEffect, useState, useRef } from "react";
import { useUserContext } from "./UserContext";
import SetProfileModal from "./SetProfileModal";
import UpdateUsernameModal from "./UpdateUsernameModal";
import UpdateLinkedinModal from "./UpdateLinkedinModal";
import UpdateGithubModal from "./UpdateGithubModal";
import { useEventTrigger } from "./EventTriggerContext";
import UpdatePasswordModal from "./UpdatePasswordModal";

const UserProfile = () => {
  const { userEmail, userName, linkedin, github } = useUserContext();
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [isProfileDetailsOpen, setIsProfileDetailsOpen] = useState(false);
  const [isProfileOpen, setProfileModalOpen] = useState(false);
  const [isuunModalOpen, setuunModalOpen] = useState(false);
  const [islinkModalOpen, setlinkModalOpen] = useState(false);
  const [isgitModalOpen, setgitModalOpen] = useState(false);
  const [iscpModalOpen, setcpModalOpen] = useState(false);
  const { profileTrigger } = useEventTrigger();
  const containerRef = useRef(null);

  const handleProfileClick = () => {
    setIsProfileDetailsOpen(!isProfileDetailsOpen);
  };
  const openProfileModal = () => {
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };

  const openuunModal = () => {
    setuunModalOpen(true);
  };

  const closeuunModal = () => {
    setuunModalOpen(false);
  };

  const openlinkModal = () => {
    setlinkModalOpen(true);
  };

  const closelinkModal = () => {
    setlinkModalOpen(false);
  };

  const opengitModal = () => {
    setgitModalOpen(true);
  };

  const closegitModal = () => {
    setgitModalOpen(false);
  };

  const opencpModal = () => {
    setcpModalOpen(true);
  };

  const closecpModal = () => {
    setcpModalOpen(false);
  };

  useEffect(() => {
    // Make a GET request to fetch the user's profile picture
    fetch("http://localhost:5000/getprofilepicture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail }), // Assuming you send the email in the request body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        // Create a URL for the blob data
        const imageUrl = URL.createObjectURL(blob);
        setProfilePictureUrl(imageUrl);
      })
      .catch((error) => {
        console.error("Profile Picture Retrieval Error:", error);
      });

    // Add a click event listener to the document to handle clicks outside the container
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !event.target.classList.contains("profile-details-span") // Check if the target is not the profile-details-span itself
      ) {
        setIsProfileDetailsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [userEmail, profileTrigger]);

  return (
    <Fragment>
      <div className="profile-details" ref={containerRef}>
        {profilePictureUrl ? (
          <img
            src={profilePictureUrl}
            alt="Profile"
            onClick={handleProfileClick}
          />
        ) : (
          <div onClick={handleProfileClick}>{userName.charAt(0)}</div>
        )}
      </div>
      <div
        className={`profile-details-span ${isProfileDetailsOpen ? "open" : ""}`}
      >
        {profilePictureUrl ? (
          <img
            src={profilePictureUrl}
            alt="Profile"
            onClick={handleProfileClick}
          />
        ) : (
          <div onClick={handleProfileClick}>{userName.charAt(0)}</div>
        )}
        <div className="camera" onClick={openProfileModal}>
          <i className="fa-solid fa-camera"></i>
        </div>
        <div className="profile-user-details">
          <span className="span-block">
            <i className="fa-solid fa-user first"></i>
            <span> {userName}</span>
            <i onClick={openuunModal} className="fa-solid fa-pencil last"></i>
          </span>
          <span className="span-block">
            <i className="fa-solid fa-envelope first"></i>
            <span>{userEmail}</span>
          </span>
          <span className="span-block">
            <a href={linkedin} target="_blank" rel="noreferrer">
              <i className="fa-brands fa-linkedin first"></i>
              <span>LinkedIn</span>
            </a>
            <i onClick={openlinkModal} className="fa-solid fa-pencil last"></i>
          </span>
          <span className="span-block">
            <a href={github} target="_blank" rel="noreferrer">
              <i className="fa-brands fa-github first"></i>
              <span>Github</span>
            </a>
            <i onClick={opengitModal} className="fa-solid fa-pencil last"></i>
          </span>
          <span className="span-block">
            <i className="fa-solid fa-lock first"></i>
            <span>Change Password</span>
            <i onClick={opencpModal} className="fa-solid fa-key last"></i>
          </span>
        </div>
      </div>
      <div>
        <SetProfileModal
          isOpen={isProfileOpen}
          onClose={closeProfileModal}
          name={userName}
          image={profilePictureUrl}
        ></SetProfileModal>
      </div>
      <div>
        <UpdateUsernameModal
          isOpen={isuunModalOpen}
          onClose={closeuunModal}
        ></UpdateUsernameModal>
      </div>
      <div>
        <UpdateLinkedinModal
          isOpen={islinkModalOpen}
          onClose={closelinkModal}
        ></UpdateLinkedinModal>
      </div>
      <div>
        <UpdateGithubModal
          isOpen={isgitModalOpen}
          onClose={closegitModal}
        ></UpdateGithubModal>
      </div>
      <div>
        <UpdatePasswordModal
          isOpen={iscpModalOpen}
          onClose={closecpModal}
        ></UpdatePasswordModal>
      </div>
    </Fragment>
  );
};

export default UserProfile;
