const Task = require("../models/tasks");

exports.addTask = (req, res) => {
  const { wsname, mailid, taskname, taskdes, deadline, status } = req.body;
  const assignedate = new Date();
  // Check if the task already exists for the given user (mailid and taskname combination)
  Task.findOne({ wsname, taskname })
    .then((taskExists) => {
      if (taskExists) {
        // If the task already exists, return an error response
        return res.status(400).json({
          message: "Task with this name already exists for the user.",
        });
      } else {
        // If the task doesn't exist, create a new task and save it
        const newTask = new Task({
          wsname,
          mailid,
          taskname,
          taskdes,
          assignedate,
          deadline,
          status,
        });

        newTask
          .save()
          .then((savedTask) => {
            // Task saved successfully
            res.status(201).json(savedTask);
          })
          .catch((error) => {
            // Handle any errors that occur during task creation and saving
            console.error("Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
          });
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the database query
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

exports.getTask = async (req, res) => {
  const { mailid, wsname } = req.body;
  try {
    // Use Promise.all to run both queries concurrently
    const [userTasks] = await Promise.all([
      Task.find({ mailid: mailid, wsname: wsname }),
    ]);

    const userTasksDetails = userTasks.map((task) => ({
      taskname: task.taskname,
      taskdesc: task.taskdes,
      deadline: task.deadline,
      status: task.status,
    }));

    res.status(200).json({
      userTasksDetails: userTasksDetails,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.setTaskStatus = async (req, res) => {
  const { mailid, wsname, taskname } = req.body;

  try {
    // Find the task by mailid, wsname, and taskname
    const task = await Task.findOne({ mailid, wsname, taskname });

    if (!task) {
      // Task not found
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task's status to false
    task.status = false;

    // Save the updated task
    await task.save();

    // Send a success response
    res.status(200).json({ message: "Task status updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
