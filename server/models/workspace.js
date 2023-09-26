const mongoose = require("mongoose");
// Workspace data
const Workspace = mongoose.model("workspaces", {
  owner: String,
  wsname: String,
  wspwd: String,
  maxmem: Number,
  status: Number,
});

module.exports = Workspace;
