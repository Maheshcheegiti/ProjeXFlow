import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEventTrigger } from "./EventTriggerContext";

const SetTaskModal = ({ isOpen, onClose, details }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const { taskTrigger, setTaskTrigger } = useEventTrigger();
  const hosturl = process.env.API_URL;

  const [formData, setFormData] = useState({
    taskname: "",
  });

  if (!isOpen) return null;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function setTaskApiCall(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const { taskname } = formData;
    // Perform form validation
    const errors = {};

    if (taskname !== details.TaskName) {
      errors.taskname = "Taskname should matches";
    }
    if (Object.keys(errors).length === 0) {
      // If no validation errors, make the API call
      fetch(`${hosturl}/settaskstatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailid: details.userEmail,
          wsname: details.wsname,
          taskname: details.TaskName,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              toast.error("Task not found", {
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
          setTaskTrigger(!taskTrigger);
          toast.success(`🤩 Task Completed Successfully.. Great Job`, {
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
          <h2>Completed Task?</h2>
          <p>
            if you completed your task then type <b>{details.TaskName}</b> below
            to confirm
          </p>
          <form onSubmit={setTaskApiCall}>
            <div className="inputs">
              <label htmlFor="task-name">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </label>
              <input
                type="text"
                name="taskname"
                id="task-name"
                placeholder="Task name"
                value={formData.taskname}
                onChange={handleInputChange}
              />
              <div className="clear"></div>

              <p className="ws-error">
                once you make changes task marked as done permanently.
              </p>
            </div>
            <div className="clear"></div>
            <button className="close-button btn" type="submit">
              <i className="fa-solid fa-circle-check"></i> Done
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

export default SetTaskModal;
