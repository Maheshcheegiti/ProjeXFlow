import React, { Fragment, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useWsname } from "./WsnameContext";
import { useUserContext } from "./UserContext";
import AddModal from "./AddModal";
import SetTaskModal from "./SetTaskModal";
import { toast } from "react-toastify";
import { initializeSocket } from "./SocketManager";
import { useEventTrigger } from "./EventTriggerContext";

const WorkSpaceFull = () => {
  const [teamMembers, setTeamMembers] = useState({});
  const [AddModalOpen, setaddModalOpen] = useState(false);
  const [SetTaskModalOpen, setTaskModalOpen] = useState(false);
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const { wsname } = useWsname();
  const [tasks, setTasks] = useState([]);
  const [teamMax, setTeamMax] = useState(0);
  const { userEmail, userName } = useUserContext();
  const [TaskName, setTaskName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatEmpty, setIsChatEmpty] = useState(true);
  const socket = initializeSocket();
  const chatContainerRef = useRef(null);
  const { teamTrigger, taskTrigger } = useEventTrigger();
  const tasksListContainerRef = useRef(null);
  const teamListContainerRef = useRef(null);
  const [isTeamListOverflowing, setIsTeamListOverflowing] = useState(false);
  const [isScrollButtonRotatedTeams, setIsScrollButtonRotatedTeams] =
    useState(false);
  const [isScrollButtonRotatedTasks, setIsScrollButtonRotatedTasks] =
    useState(false);
  const [isScrollButtonRotatedChats, setIsScrollButtonRotatedChats] =
    useState(true);
  const [isChatScrolledUp, setIsChatScrolledUp] = useState(false);

  useEffect(() => {
    // Fetch team member information from the /team API
    fetch(`http://localhost:5000/team`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wsname }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTeamMembers(data.userInformation);
        setTeamMax(data.wsmax);
        setIsScrollButtonRotatedTeams(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        // Handle error as needed
      });

    fetch("http://localhost:5000/gettasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mailid: userEmail, wsname: wsname }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the tasks state with the obtained tasks data
        setTasks(data.userTasksDetails);
        setIsScrollButtonRotatedTasks(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        // Handle error as needed
      });

    fetch("http://localhost:5000/getchat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wsname }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the chatMessages state with the obtained chat messages
        setChatMessages(data);
        setIsScrollButtonRotatedChats(true);
        setIsChatEmpty(data.length === 0); // Check if chat is empty
      })
      .catch((error) => {
        console.error("API Error:", error);
        // Handle error as needed
      });
  }, [wsname, userEmail, teamTrigger, taskTrigger]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const openAddModal = (Email, Username) => {
    setaddModalOpen(true);
    setEmail(Email);
    setName(Username);
  };
  const closeAddModal = () => {
    setaddModalOpen(false);
  };

  const openSetTaskModal = (Taskname) => {
    setTaskModalOpen(true);
    setTaskName(Taskname);
  };
  const closeSetTaskModal = () => {
    setTaskModalOpen(false);
  };

  const handleSendMessage = (event) => {
    event.preventDefault(); // Prevent the form from submitting

    // Make a POST request to send the new message
    fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mailid: userEmail,
        username: userName,
        wsname: wsname,
        message: newMessage,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Display a toast message indicating the message was sent successfully
        toast.success("Message sent successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setIsChatEmpty(false);
        socket.emit("chat message", {
          mailid: userEmail,
          username: userName,
          message: newMessage,
        });
        // Clear the input field after sending the message
        setNewMessage("");
      })
      .catch((error) => {
        console.error("API Error:", error);
        // Handle error as needed
      });

    // Clear the input field after sending the message
    // setNewMessage("");
  };

  useEffect(() => {
    // Listen for incoming chat messages from the server
    socket.on("chat message", (msg) => {
      // Add the received message to the chatMessages state
      setChatMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => {
      // Clean up the event listener when the component unmounts
      socket.off("chat message");
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const isListScrollable = (container) => {
    if (container.current) {
      const { scrollHeight, clientHeight } = container.current;
      return scrollHeight > clientHeight;
    }
    return false;
  };

  const scrollToBottomList = (container) => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight;
      if (container === teamListContainerRef)
        setIsScrollButtonRotatedTeams(true);
      if (container === tasksListContainerRef)
        setIsScrollButtonRotatedTasks(true);
      if (container === chatContainerRef) setIsScrollButtonRotatedChats(true);
    }
  };

  useEffect(() => {
    setIsTeamListOverflowing(isListScrollable(teamListContainerRef));
  }, [teamMembers]);

  function scrollToTop(container) {
    if (container.current) {
      container.current.scrollTop = 0;
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;
        if (scrollTop === 0) {
          setIsScrollButtonRotatedChats(false);
        }
        const maxScroll = scrollHeight - clientHeight;
        const scrollThreshold = 300;
        if (maxScroll - scrollTop > scrollThreshold) {
          setIsChatScrolledUp(true);
        } else {
          setIsChatScrolledUp(false);
        }
      }
    };

    chatContainerRef.current.addEventListener("scroll", handleScroll);
  }, []);

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
    tasksListContainerRef.current.addEventListener(
      "scroll",
      handleScroll(tasksListContainerRef, setIsScrollButtonRotatedTasks)
    );
    teamListContainerRef.current.addEventListener(
      "scroll",
      handleScroll(teamListContainerRef, setIsScrollButtonRotatedTeams)
    );
  }, []);

  return (
    <Fragment>
      <div className="ws-full">
        <div className="ws-chat" ref={chatContainerRef}>
          <div id="msgs">
            {/* Conditionally render chat messages or "No chat" message */}
            {isChatEmpty ? (
              <div id="ws-chat-temp">
                <i className="fa-regular fa-comments fa-shake"></i>
                <p>
                  Chat in real time with your team members. Discuss project
                  updates, share ideas, and collaborate seamlessly.
                </p>
              </div>
            ) : (
              <ul className="ws-chat-list">
                {chatMessages.map((message, index) => (
                  <li
                    key={index}
                    className={
                      message.mailid === userEmail ? "sentmsg" : "recmsg"
                    }
                  >
                    <p className="chat-username">{message.username}</p>
                    <p className="chat-msg">{message.message}</p>
                    <div className="chat-time">{message.time}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="msg-input">
            <form className="msg-form inputs" onSubmit={handleSendMessage}>
              <input
                required
                type="text"
                name="msg"
                id="msg"
                placeholder="Send message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button className="btn msg-btn" type="submit">
                Send
              </button>
            </form>
          </div>
          <section
            className={`scroll-down ws chat ${
              isChatScrolledUp ? "visible" : ""
            } ${isScrollButtonRotatedChats ? "rotate" : ""}`}
            onClick={() => {
              if (isScrollButtonRotatedChats) {
                // If rotated, scroll to top and reset rotation
                scrollToTop(chatContainerRef);
                setIsScrollButtonRotatedChats(false);
              } else {
                // If not rotated, scroll to bottom and rotate
                scrollToBottomList(chatContainerRef);
                setIsScrollButtonRotatedChats(true);
              }
            }}
          >
            <i className="fa-solid fa-circle-down"></i>
          </section>
        </div>
        <div className="ws-right">
          <div className="ws-team">
            <div className="ws-team-title">
              <h2>Team Members</h2>
              <p>
                {Object.entries(teamMembers).length}/{teamMax}
              </p>
            </div>
            <div className="ws-team-list" ref={teamListContainerRef}>
              <ul className="team-list">
                {Object.entries(teamMembers).map(([email, memberInfo]) => (
                  <li key={email}>
                    <ul className="person-list">
                      <li>{memberInfo.username}</li>
                      <i
                        onClick={() => {
                          openAddModal(email, memberInfo.username);
                        }}
                        className={
                          memberInfo.isOwner
                            ? "fa-regular fa-circle-user"
                            : "fa-solid fa-plus"
                        }
                      ></i>
                      <Link
                        to={memberInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fa-brands fa-linkedin"></i>
                      </Link>
                      <Link
                        to={memberInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fa-brands fa-github"></i>
                      </Link>
                    </ul>
                  </li>
                ))}
              </ul>
              <section
                className={`scroll-down ws ${
                  isTeamListOverflowing ? "visible" : ""
                } ${isScrollButtonRotatedTeams ? "rotate" : ""}`}
                onClick={() => {
                  if (isScrollButtonRotatedTeams) {
                    // If rotated, scroll to top and reset rotation
                    scrollToTop(teamListContainerRef);
                    setIsScrollButtonRotatedTeams(false);
                  } else {
                    // If not rotated, scroll to bottom and rotate
                    scrollToBottomList(teamListContainerRef);
                    setIsScrollButtonRotatedTeams(true);
                  }
                }}
              >
                <i className="fa-solid fa-circle-down"></i>
              </section>
            </div>
          </div>
          <div className="ws-tasks">
            <div className="ws-tasks-title">
              <h2>My Tasks</h2>
              <p>{tasks.length}</p>
            </div>
            <div className="ws-tasks-list" ref={tasksListContainerRef}>
              {tasks.map((task) => (
                <div key={task.taskname}>
                  <ul>
                    <li>{task.taskname}</li>
                    <li>{task.taskdesc}</li>
                    <li>
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "No Deadline"}
                    </li>
                    <li>
                      {task.status ? (
                        <i
                          onClick={() => {
                            openSetTaskModal(task.taskname);
                          }}
                          className="fa-solid fa-hourglass fa-spin"
                        ></i>
                      ) : (
                        <i className="fa-solid fa-circle-check"></i>
                      )}
                    </li>
                  </ul>
                </div>
              ))}
              <section
                className={`scroll-down ws ${
                  isListScrollable(tasksListContainerRef) ? "visible" : ""
                } ${isScrollButtonRotatedTasks ? "rotate" : ""}`}
                onClick={() => {
                  if (isScrollButtonRotatedTasks) {
                    // If rotated, scroll to top and reset rotation
                    scrollToTop(tasksListContainerRef);
                    setIsScrollButtonRotatedTasks(false);
                  } else {
                    // If not rotated, scroll to bottom and rotate
                    scrollToBottomList(tasksListContainerRef);
                    setIsScrollButtonRotatedTasks(true);
                  }
                }}
              >
                <i className="fa-solid fa-circle-down"></i>
              </section>
            </div>
            <div className="tasks-footer"></div>
          </div>
        </div>
      </div>
      <div>
        <AddModal
          isOpen={AddModalOpen}
          onClose={closeAddModal}
          details={{ Email, Name, wsname }}
        ></AddModal>
      </div>
      <div>
        <SetTaskModal
          isOpen={SetTaskModalOpen}
          onClose={closeSetTaskModal}
          details={{ userEmail, TaskName, wsname }}
        ></SetTaskModal>
      </div>
    </Fragment>
  );
};

export default WorkSpaceFull;
