import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "./UserContext";
import { useEventTrigger } from "./EventTriggerContext";

const CreateModal = ({ isOpen, onClose }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const hosturl = process.env.API_URL;
  const { userEmail } = useUserContext();
  const { wsTrigger, setWSTrigger } = useEventTrigger();

  const [formData, setFormData] = useState({
    wsname: "",
    wspwd: "",
    maxmem: "",
  });
  if (!isOpen) return null;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function createwsApiCall(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const mailid = userEmail;
    console.log(mailid);
    const { wsname, wspwd, maxmem } = formData;
    // Perform form validation
    const errors = {};

    // Username must be at least 4 characters
    if (wsname.length < 4) {
      errors.username = "Workspace name must be at least 4 characters";
    }

    // Password must be at least 4 characters and match confirm password
    if (wspwd.length < 4) {
      errors.password = "Password must be at least 4 characters";
    }

    if (maxmem < 2) {
      errors.maxmem = "Atleast 2 members are required";
    }

    if (Object.keys(errors).length === 0) {
      // If no validation errors, make the API call
      fetch(`${hosturl}/createws`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: mailid,
          wsname: wsname,
          wspwd: wspwd,
          maxmem: maxmem,
          status: 1,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 400) {
              // User is already registered, show an error toast
              toast.error("Workspace is already Exists", {
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
          toast.success("👨🏻‍💻 Successfully Workspace created!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    } else {
      // Display validation errors using toast notifications
      setValidationErrors(errors);
      for (const error of Object.values(errors)) {
        toast.error(error, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }
  return (
    <Fragment>
      <div className="modal-overlay">
        <div className="modal form-section">
          <h2>Create a new workspace</h2>
          <p>Provide below details to create a new workspace.</p>
          <form onSubmit={createwsApiCall}>
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
              <label htmlFor="maxmem" className="number-label">
                Max Members <i className="fa-solid fa-people-group"></i>
              </label>
              <input
                type="number"
                className="number-input"
                name="maxmem"
                value={formData.maxmem}
                onChange={handleInputChange}
              />
            </div>
            <div className="clear"></div>
            <button className="close-button btn" type="submit">
              <i className="fa-regular fa-square-plus"></i> Create
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

export default CreateModal;
