const mongoose = require("mongoose");

const OtpMap = mongoose.model("otpmaps", {
  maild: String,
  otp: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = OtpMap;
