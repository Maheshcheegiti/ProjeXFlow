import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "./UserContext";
import { useEventTrigger } from "./EventTriggerContext";

const JoinModal = ({ isOpen, onClose }) => {
  const { userEmail } = useUserContext();
  const [formData, setFormData] = useState({
    wsname: "",
    wspwd: "",
    status: null,
  });
  const [statusValue, setStatusValue] = useState(null);
  const { wsTrigger, setWSTrigger } = useEventTrigger();

  useEffect(() => {
    // Update formData.status when statusValue changes
    setFormData((prevFormData) => ({
      ...prevFormData,
      status: statusValue,
    }));
  }, [statusValue]);

  if (!isOpen) return null;

  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    if (name === "wsname") {
      try {
        const response = await fetch("http://localhost:5000/getwsstatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wsname: value }),
        });

        if (!response.ok) {
          if (response.status === 404) {
            setStatusValue(0);
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setStatusValue(data.status);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  function joinws(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const mailid = userEmail;
    const { wsname, wspwd } = formData;
    fetch("http://localhost:5000/joinws", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        owner: mailid,
        wsname: wsname,
        wspwd: wspwd,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            // User is already registered, show an error toast
            toast.error("You already in the workspace", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            return;
          } else if (response.status === 402) {
            // User is already registered, show an error toast
            toast.error("Workspace is fulled!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            return;
          } else if (response.status === 401) {
            // User is already registered, show an error toast
            toast.error("Password not matches!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            return;
          } else if (response.status === 404) {
            toast.error("Workspace Not Exists..!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            return;
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }

        onClose();
        setWSTrigger(!wsTrigger);
        toast.success("👨🏻‍💻 Successfully joined into a new workspace!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // manually closing model
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }
  return (
    <Fragment>
      <div className="modal-overlay">
        <div className="modal form-section">
          <h2>Join in a workspace</h2>
          <p>Provide below details to join in a workspace.</p>
          <form onSubmit={joinws}>
            <div className="inputs">
              <label htmlFor="ws-name">
                <i className="fa-regular fa-square-plus"></i>
              </label>
              <input
                type="text"
                name="wsname"
                id="ws-name"
                placeholder="Workspace name"
                value={formData.wsname}
                onChange={handleInputChange}
              />
              {statusValue === 0 && (
                <p className="ws-error">Workspace not exists..!</p>
              )}
              {statusValue > 0 && (
                <p className="ws-success">Workspace exists..!</p>
              )}
              <div className="clear"></div>
              <label htmlFor="ws-password">
                <i className="fa-solid fa-lock"></i>
              </label>
              <input
                type="password"
                name="wspwd"
                id="ws-password"
                placeholder="Password"
                value={formData.wspwd}
                onChange={handleInputChange}
              />
              <div className="clear"></div>
              <label htmlFor="status" className="number-label">
                Status <i className="fa-solid fa-people-group"></i>
              </label>
              <input
                type="number"
                className="number-input number-input-join"
                readOnly
                value={formData.status}
              />
            </div>
            <div className="clear"></div>
            <button className="close-button btn" type="submit">
              <i className="fa-solid fa-arrow-right-to-bracket"></i> Join
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

export default JoinModal;
