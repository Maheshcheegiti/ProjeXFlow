const mongoose = require("mongoose");

const User = mongoose.model("users", {
  username: String,
  mailid: String,
  password: String,
  linkedin: String,
  github: String,
  profilePicture: String,
  terms: Boolean,
});

module.exports = User;
