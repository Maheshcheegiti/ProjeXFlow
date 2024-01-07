import CreateModal from "./CreateModal";
import JoinModal from "./JoinModal";
import React, { Fragment, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";
import { useWsname } from "./WsnameContext";
import { useEventTrigger } from "./EventTriggerContext";
import SetProfileModal from "./SetProfileModal";
import ShareModal from "./ShareModal";

const WorkspaceBar = () => {
  const [CreateModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [isProfileOpen, setProfileModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { updateWsname } = useWsname();
  const [activeLink, setActiveLink] = useState(null); // State to track the active link
  const { wsTrigger, signInTrigger } = useEventTrigger();
  const workspaceListRef = useRef(null); // Reference to the workspace list container
  const [isScrollButtonRotated, setIsScrollButtonRotated] = useState(false);
  const { userEmail, userName } = useUserContext();
  const [wsnameforModal, setwsnameforModal] = useState("");
  const hosturl = process.env.API_URL;

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const openJoinModal = () => {
    setJoinModalOpen(true);
  };

  const closeoJoinModal = () => {
    setJoinModalOpen(false);
  };
  const openProfileModal = () => {
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };
  const openShareModal = (wsname) => {
    setwsnameforModal(wsname);
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
  };

  const [workspaces, setWorkspaces] = useState({
    userWorkspaces: [],
    createdWorkspaces: [],
  });

  useEffect(() => {
    const savedActiveLink = localStorage.getItem("activeLink");
    if (savedActiveLink) {
      updateWsname(savedActiveLink.split("-")[1]);
      setActiveLink(savedActiveLink);
    }
  }, [updateWsname]);

  // Function to handle link click and set the active link
  const handleLinkClick = (index) => {
    setActiveLink(index);
    localStorage.setItem("activeLink", index);
  };

  const scrollWorkspaceListDown = () => {
    if (workspaceListRef.current) {
      const { scrollHeight, clientHeight } = workspaceListRef.current;
      if (scrollHeight > clientHeight) {
        workspaceListRef.current.scrollTop = scrollHeight;
        setIsScrollButtonRotated(true);
      }
    }
  };

  const isScrollable = () => {
    if (workspaceListRef.current) {
      const ul1 = workspaceListRef.current.querySelector(".ul1");
      const ul2 = workspaceListRef.current.querySelector(".ul2");
      return (
        ul1.scrollHeight + ul2.scrollHeight >
        workspaceListRef.current.clientHeight
      );
    }
    return false;
  };

  function scrollToTop(container) {
    if (container.current) {
      container.current.scrollTop = 0;
    }
  }

  useEffect(() => {
    const handleScroll = (containerRef, setIsScrollButtonRotated) => {
      return () => {
        if (containerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } =
            containerRef.current;
          const scrollThreshold = 10;
          const isAtBottom =
            scrollHeight - scrollTop <= clientHeight + scrollThreshold;

          setIsScrollButtonRotated(isAtBottom);
        }
      };
    };

    // Add the scroll event listeners to all containers
    workspaceListRef.current.addEventListener(
      "scroll",
      handleScroll(workspaceListRef, setIsScrollButtonRotated)
    );
  }, []);

  useEffect(() => {
    // Fetch workspaces from the /getws API
    fetch(`${hosturl}/getws`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mailid: userEmail }),
    })
      .then((response) => response.json())
      .then((data) => {
        setWorkspaces(data);

        // After fetching data, check if scroll is needed
        const scrollNeeded = isScrollable();
        if (scrollNeeded) {
          // You can trigger the scroll button to appear here if needed
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast.error("Error fetching workspaces", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  }, [userEmail, wsTrigger]);

  useEffect(() => {
    if (signInTrigger) {
      openProfileModal();
    }
  }, [signInTrigger]);

  return (
    <Fragment>
      <div className="workspace">
        <div className="ws-title">
          <h2>Workspaces</h2>
        </div>
        <div className="ws-list" ref={workspaceListRef}>
          <ul className="ul1">
            {workspaces.createdWorkspaces.map((wsname) => (
              <Link
                to={`/workspace/chat`}
                className={`ws-list-items created ${
                  activeLink === `created-${wsname}` ? "active" : ""
                }`}
                key={`created-${wsname}`}
                onClick={() => {
                  updateWsname(wsname);
                  handleLinkClick(`created-${wsname}`);
                }}
              >
                <li>
                  <span>{wsname}</span>
                  <i
                    onClick={() => {
                      openShareModal(wsname);
                    }}
                    className="fa-solid fa-share-from-square"
                  ></i>
                </li>
              </Link>
            ))}
          </ul>
          <ul className="ul2">
            {workspaces.userWorkspaces.map((wsname) => (
              <Link
                to={`/workspace/chat`}
                className={`ws-list-items ${
                  activeLink === `user-${wsname}` ? "active" : ""
                }`}
                key={`user-${wsname}`}
                onClick={() => {
                  updateWsname(wsname);
                  handleLinkClick(`user-${wsname}`);
                }}
              >
                <li>{wsname}</li>
              </Link>
            ))}
          </ul>
          <div
            className={`scroll-down ${isScrollable() ? "visible" : ""} ${
              isScrollButtonRotated ? "rotate" : ""
            }`}
            onClick={() => {
              if (isScrollButtonRotated) {
                // If rotated, scroll to top and reset rotation
                scrollToTop(workspaceListRef);
                setIsScrollButtonRotated(false);
              } else {
                // If not rotated, scroll to bottom and rotate
                scrollWorkspaceListDown();
                setIsScrollButtonRotated(true);
              }
            }}
          >
            <i className="fa-solid fa-circle-down"></i>
          </div>
        </div>
        <div className="ws-foot">
          <ul>
            <li onClick={openCreateModal}>
              <i className="fa-regular fa-square-plus"></i> <p>Create</p>
            </li>
            <li onClick={openJoinModal}>
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              <p>Join</p>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <CreateModal
          isOpen={CreateModalOpen}
          onClose={closeCreateModal}
        ></CreateModal>
      </div>
      <div>
        <JoinModal isOpen={joinModalOpen} onClose={closeoJoinModal}></JoinModal>
      </div>
      <div>
        <SetProfileModal
          isOpen={isProfileOpen}
          onClose={closeProfileModal}
          name={userName}
        ></SetProfileModal>
      </div>
      <div>
        <ShareModal
          isOpen={shareModalOpen}
          onClose={closeShareModal}
          wsName={wsnameforModal}
        ></ShareModal>
      </div>
    </Fragment>
  );
};

export default WorkspaceBar;
