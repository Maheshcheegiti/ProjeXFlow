import React, { Fragment, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "./UserContext";
import ClipboardJS from "clipboard";

const ShareModal = ({ isOpen, onClose, wsName }) => {
  const { userEmail } = useUserContext();
  const [workspaceDetails, setWorkspaceDetails] = useState(null);
  const workspaceNameRef = useRef(null);
  const workspacePasswordRef = useRef(null);
  const [formData, setFormData] = useState({
    teamEmails: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/getworkspacedetails",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ wsname: wsName }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setWorkspaceDetails(data);
        } catch (error) {
          console.error("Error fetching workspace details:", error);
        }
      };
      fetchData();
    }
  }, [isOpen, wsName]);

  useEffect(() => {
    if (workspaceDetails) {
      const clipboard = new ClipboardJS(".copy-icon", {
        text: function (trigger) {
          // You can customize the text to be copied here
          const workspaceNameRefValue = workspaceNameRef.current;
          const workspacePasswordRefValue = workspacePasswordRef.current;

          if (workspaceNameRefValue && workspacePasswordRefValue) {
            const workspaceName = workspaceNameRefValue.textContent;
            const workspacePassword = workspacePasswordRefValue.textContent;
            return `Workspace: ${workspaceName}, Password: ${workspacePassword}`;
          } else {
            // Handle the case where refs are not available yet
            return "";
          }
        },
      });
    }
  }, [workspaceDetails]);

  if (!isOpen) return null;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateEmails = (emails) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailArray = emails.split(",").map((email) => email.trim());
    const invalidEmails = emailArray.filter((email) => !emailRegex.test(email));
    return invalidEmails;
  };

  function shareWorkspaceApiCall(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const mailid = userEmail;
    const { teamEmails } = formData;
    const invalidEmails = validateEmails(teamEmails);

    if (invalidEmails.length > 0) {
      toast.error(
        "Invalid email format for the following email(s): " +
          invalidEmails.join(", "),
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      return;
    }

    if (workspaceDetails) {
      const maxMem = workspaceDetails.maxmem;
      const currentStatus = workspaceDetails.status;
      const emailsArray = teamEmails.split(",").map((email) => email.trim());

      if (currentStatus === maxMem) {
        toast.error("Workspace is full. No more emails can be added.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      const availableSlots = maxMem - currentStatus;

      if (emailsArray.length > availableSlots) {
        toast.error(`Only ${availableSlots} more emails can be added.`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      setIsLoading(true);
      // Split the input by commas and send the array of email addresses to the API
      fetch("http://localhost:5000/shareworkspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: mailid,
          emails: emailsArray,
          wsname: workspaceDetails.wsname,
          wspwd: workspaceDetails.wspwd,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            // Handle errors as needed
            console.error("API Error:", response.statusText);
            return;
          }
          onClose();
          toast.success("👨🏻‍💻 Successfully shared workspace with teammates!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("API Error:", error);
          setIsLoading(false);
        });
    }
  }

  return (
    <Fragment>
      <div className="modal-overlay">
        <div className="modal form-section workspace-modal">
          <h2>Share Workspace with Teammates</h2>

          <form onSubmit={shareWorkspaceApiCall}>
            <div className="inputs">
              <label htmlFor="team-emails">
                <i className="fa-regular fa-envelope"></i>
                <p>Provide emails of your teammates to share your workspace.</p>
              </label>
              {workspaceDetails && (
                <div className="ws-details" id="workspace-info">
                  <div>
                    <div>
                      <b>Workspace: </b>
                      <span ref={workspaceNameRef}>
                        {workspaceDetails.wsname}
                      </span>
                    </div>
                    <div>
                      <b>Password: </b>
                      <span ref={workspacePasswordRef}>
                        {workspaceDetails.wspwd}
                      </span>
                    </div>
                    <div>
                      <b>MaxMem: </b>
                      {workspaceDetails.maxmem}
                    </div>
                    <div>
                      <b>Status: </b>
                      {workspaceDetails.status}
                    </div>
                  </div>
                  <div
                    className="copy-icon"
                    data-clipboard-target="#workspace-info"
                    onClick={() => {
                      toast.success("📋 Copied workspace name and password!", {
                        autoClose: 1000,
                      });
                    }}
                  >
                    <i className="fa-regular fa-copy"></i>
                  </div>
                </div>
              )}
              <textarea
                rows="4"
                name="teamEmails"
                id="team-emails"
                placeholder="Teammates' emails (comma-separated)"
                value={formData.teamEmails}
                onChange={handleInputChange}
              />
              {isLoading && (
                <div className="loading-container">
                  <span className="circle-span"></span>
                </div>
              )}
            </div>
            <div className="clear"></div>
            <button className="close-button btn" type="submit">
              {isLoading ? (
                <span>Sending...</span>
              ) : (
                <Fragment>
                  <i className="fa-solid fa-share"></i> Share
                </Fragment>
              )}
            </button>
            <button className="close-button btn" onClick={onClose}>
              <i className="fa-regular fa-circle-xmark"></i> Cancel
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ShareModal;
