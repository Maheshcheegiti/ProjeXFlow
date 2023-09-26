const Chat = require("../models/chats");

exports.Chats = async (req, res) => {
  const { mailid, username, wsname, message } = req.body;
  const time = new Date();
  try {
    const newChat = new Chat({
      mailid,
      username,
      wsname,
      message,
      time,
    });
    // Save the new chat message to the database
    await newChat.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getChat = async (req, res) => {
  const wsname = req.body.wsname;

  try {
    // Fetch chat messages for the specified wsname, filter, and sort by time
    const chatMessages = await Chat.find({ wsname })
      .select("mailid username message time")
      .sort("time");

    // Prepare the response with username, message, and time fields
    const formattedMessages = chatMessages.map((message) => ({
      mailid: message.mailid,
      username: message.username,
      message: message.message,
      time: message.time.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
