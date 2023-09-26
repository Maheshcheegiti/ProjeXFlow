const User = require("../models/user");
const upload = require("../configs/multer");

exports.SetProfile = async (req, res) => {
  const email = req.body.mailid;
  try {
    const user = await User.findOne({ mailid: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.profilePicture = req.file.filename;
    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
