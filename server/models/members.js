const mongoose = require("mongoose");

const Members = mongoose.model("members", {
  mailid: String,
  wsname: String,
});

module.exports = Members;
