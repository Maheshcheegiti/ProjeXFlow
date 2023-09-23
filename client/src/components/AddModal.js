import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEventTrigger } from "./EventTriggerContext";

const AddModal = ({ isOpen, onClose, details }) => {
  const { teamTrigger, setTeamTrigger } = useEventTrigger();
  const [formData, setFormData] = useState({
    taskname: "",
    taskdes: "",
    date: "",
  });

  const today = new Date();
  today.setDate(today.getDate());

  if (!isOpen) return null;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function assignTaskApiCall(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const { taskname, taskdes, date } = formData;
    // Perform form validation
    const errors = {};

    if (taskname.length < 4) {
      errors.taskname = "Task name must be at least 4 characters";
    }

    if (taskdes.length < 4) {
      errors.taskdes = "Task description be at least 4 characters";
    }

    if (Object.keys(errors).length === 0) {
      // If no validation errors, make the API call
      fetch("http://localhost:5000/addtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wsname: details.wsname,
          mailid: details.Email,
          taskname: taskname,
          taskdes: taskdes,
          deadline: date,
          status: true,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 400) {
              // User is already registered, show an error toast
              toast.error("Task is already assigned", {
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
          setTeamTrigger(!teamTrigger);
          toast.success(`👨🏻‍💻 Successfully assigned task to ${details.Name}!`, {
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
          <h2>Assign Task</h2>
          <p>
            Provide below details to assign task to <b>{details.Name}</b>
          </p>
          <form>
            <div className="inputs">
              <label htmlFor="task-name">
                <i className="fa-regular fa-square-plus"></i>
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
              <label htmlFor="taskdes">
                <i className="fa-solid fa-circle-info"></i>
              </label>
              <input
                type="text"
                name="taskdes"
                id="taskdes"
                placeholder="Task description"
                value={formData.taskdes}
                onChange={handleInputChange}
              />
              <div className="clear"></div>
              <label htmlFor="maxmem" className="number-label">
                Deadline <i className="fa-solid fa-calendar-day"></i>
              </label>
              <input
                type="date"
                className="number-input date-input"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={today.toISOString().split("T")[0]}
              />
              {!formData.date && (
                <p className="ws-error">
                  if you not set deadline it means there is no deadline for that
                  task.
                </p>
              )}
            </div>
            <div className="clear"></div>
          </form>
          <button
            className="close-button btn"
            type="submit"
            onClick={assignTaskApiCall}
          >
            <i className="fa-regular fa-square-plus"></i> Assign
          </button>
          <button className="close-button btn" onClick={onClose}>
            <i className="fa-regular fa-circle-xmark"></i> Cancel
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default AddModal;
