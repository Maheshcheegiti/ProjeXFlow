const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = require("socket.io")(server); // Pass the server to Socket.io
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const teamsRoutes = require("./routes/teamRoutes");
const tasksRoutes = require("./routes/taskRoutes");
const chatRoutes = require("./routes/chatRoutes");

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your client's origin
};

app.use(cors(corsOptions));

require("dotenv").config();

// Add this code after initializing your Express app and before app.listen()
io.on("connection", (socket) => {
  // Handle socket events here
  console.log("A user connected");

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    // Create a message object with the username and timestamp
    const messageWithInfo = {
      mailid: msg.mailid,
      username: msg.username,
      message: msg.message,
      time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }), // or any other timestamp format you prefer
    };

    // Broadcast the message with additional info to all connected clients
    io.emit("chat message", messageWithInfo);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const db = require("./configs/mongoose");
const upload = require("./configs/multer");

const User = require("./models/user");

app.use("/", userRoutes);
app.use("/", workspaceRoutes);
app.use("/", teamsRoutes);
app.use("/", tasksRoutes);
app.use("/", chatRoutes);

// Endpoint for uploading a profile picture
app.post(
  "/setprofilepicture",
  upload.single("profilePicture"),
  async (req, res) => {
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
  }
);

app.post("/getprofilepicture", async (req, res) => {
  try {
    const email = req.body.email; // Assuming you send the email in the request body

    const user = await User.findOne({ mailid: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assuming you have a 'profilePicture' field in your User model
    const profilePicture = user.profilePicture;

    // Check if the user has a profile picture set
    if (!profilePicture) {
      return res
        .status(404)
        .json({ error: "Profile picture not found for this user" });
    }

    // Send the profile picture file as a response
    res.sendFile(`${__dirname}/profile_pictures/${profilePicture}`);
  } catch (error) {
    console.error("Profile Picture Retrieval Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server using the HTTP server instance
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
