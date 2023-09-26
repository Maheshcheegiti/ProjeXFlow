const mongoose = require("mongoose");
// Define a Mongoose model for the chat data
const Chat = mongoose.model("chats", {
  mailid: String,
  username: String,
  wsname: String,
  message: String,
  time: Date,
});

module.exports = Chat;
