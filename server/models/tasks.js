const mongoose = require("mongoose");

// Define a Mongoose model for the tasks data
const Task = mongoose.model("tasks", {
  wsname: String,
  mailid: String,
  taskname: String,
  taskdes: String,
  assignedate: Date,
  deadline: Date,
  status: Boolean,
});

module.exports = Task;
