const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const multer = require("multer");
const server = http.createServer(app); // Create an HTTP server
const io = require("socket.io")(server); // Pass the server to Socket.io
app.use(express.json());

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

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const User = require("./models/user");

app.post("/signup", async (req, res) => {
  try {
    // Extract user information from the request body
    const { username, mailid, password, linkedin, github, terms } = req.body;

    // Check if a user with the same mailid already exists
    const existingUser = await User.findOne({ mailid });

    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user document with the hashed password
    const user = new User({
      username,
      mailid,
      password: hashedPassword, // Store the hashed password
      linkedin,
      github,
      terms,
    });

    // Save the user document to the MongoDB database
    await user.save();

    console.log("User saved to the database");
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/checkmail", (req, res) => {
  const { mailid } = req.body;
  // Find the user by mailid
  User.findOne({ mailid })
    .then((user) => {
      if (user) {
        // User with the provided mailid not found
        return res.status(401).json({ error: "User already Exists" });
      } else {
        res.status(200).json({ message: "Login successful" });
      }
    })
    .catch((error) => {
      console.error("Error during checking email:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/login", async (req, res) => {
  try {
    const { mailid, password } = req.body;

    // Find the user by mailid
    const user = await User.findOne({ mailid });

    if (!user) {
      return res.status(401).json({ error: "User not registered" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, navigate to the workspace
      res.status(200).json({ message: "Login successful", details: user });
    } else {
      // Passwords do not match
      res.status(402).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update username
app.post("/changeusername", async (req, res) => {
  try {
    const { mailid, password, newUsername } = req.body;

    // Find the user by mailid
    const user = await User.findOne({ mailid });

    if (!user) {
      return res.status(401).json({ error: "User not registered" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, update the username
      user.username = newUsername;
      await user.save();

      res.status(200).json({ message: "Username updated successfully" });
    } else {
      // Passwords do not match
      res.status(402).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during username change:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update LinkedIn
app.post("/changelinkedin", async (req, res) => {
  try {
    const { mailid, password, newLinkedIn } = req.body;

    // Find the user by mailid
    const user = await User.findOne({ mailid });

    if (!user) {
      return res.status(401).json({ error: "User not registered" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, update the LinkedIn
      user.linkedin = newLinkedIn;
      await user.save();

      res.status(200).json({ message: "LinkedIn updated successfully" });
    } else {
      // Passwords do not match
      res.status(402).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during LinkedIn change:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update GitHub
app.post("/changegithub", async (req, res) => {
  try {
    const { mailid, password, newGitHub } = req.body;

    // Find the user by mailid
    const user = await User.findOne({ mailid });

    if (!user) {
      return res.status(401).json({ error: "User not registered" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, update the GitHub
      user.github = newGitHub;
      await user.save();

      res.status(200).json({ message: "GitHub updated successfully" });
    } else {
      // Passwords do not match
      res.status(402).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during GitHub change:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update password
app.post("/changepassword", async (req, res) => {
  try {
    const { mailid, currentPassword, newPassword } = req.body;

    // Find the user by mailid
    const user = await User.findOne({ mailid });

    if (!user) {
      return res.status(401).json({ error: "User not registered" });
    }

    // Compare the provided current password with the stored hashed password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (passwordMatch) {
      // Passwords match, hash and update the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } else {
      // Passwords do not match
      res.status(402).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during password change:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Workspace data
const Workspace = mongoose.model("workspaces", {
  owner: String,
  wsname: String,
  wspwd: String,
  maxmem: Number,
  status: Number,
});

app.post("/createws", (req, res) => {
  const { owner, wsname, wspwd, maxmem, status } = req.body;
  Workspace.findOne({ wsname })
    .then((existingws) => {
      if (existingws) {
        // User with the same username or mailid already exists
        return res.status(400).json({ error: "Workspace already registered" });
      }

      // Create a new user document
      const worspace = new Workspace({
        owner,
        wsname,
        wspwd,
        maxmem,
        status,
      });

      // Save the user document to the MongoDB database
      return worspace
        .save()
        .then(() => {
          console.log("workspace saved to the database");
          res.status(201).json({ message: "Workspace created successfully" });
        })
        .catch((error) => {
          console.error("Error creating workspace:", error);
          res.status(500).json({ error: "Internal Server Error" });
        });
    })
    .catch((error) => {
      console.error("Error checking for existing workspace:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/getwsstatus", (req, res) => {
  const wsname = req.body.wsname; // Assuming you're passing wsname as a query parameter
  Workspace.findOne({ wsname })
    .then((workspace) => {
      if (workspace) {
        // If a workspace with the given wsname is found
        const status = workspace.status;
        res.status(200).json({ status });
      } else {
        // If no workspace is found with the given wsname
        res.status(404).json({ message: "Workspace not found" });
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the database query
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

const Members = mongoose.model("members", {
  mailid: String,
  wsname: String,
});

app.post("/joinws", (req, res) => {
  const { owner, wsname, wspwd } = req.body;
  const mailid = owner;
  Workspace.findOne({ wsname })
    .then((workspace) => {
      if (workspace) {
        // If a workspace with the given wsname is found
        if (workspace.wspwd === wspwd) {
          Members.findOne({ mailid, wsname })
            .then((existingmem) => {
              if (existingmem) {
                // User with the same username or mailid already exists
                return res
                  .status(400)
                  .json({ error: "You already in the workspace" });
              } else if (mailid === workspace.owner) {
                return res
                  .status(400)
                  .json({ error: "You already in the workspace" });
              }

              // Create a new user document
              const member = new Members({
                mailid,
                wsname,
              });

              if (workspace.status === workspace.maxmem) {
                res.status(402).json({ error: "Workspace is fulled." });
                return;
              } else {
                workspace.status = workspace.status + 1;
                workspace.save();
              }
              // Save the user document to the MongoDB database
              return member
                .save()
                .then(() => {
                  console.log("member saved to the database");
                  res
                    .status(201)
                    .json({ message: "you are joined in a new workspace." });
                })
                .catch((error) => {
                  console.error("Error joining workspace:", error);
                  res.status(500).json({ error: "Internal Server Error" });
                });
            })
            .catch((error) => {
              console.error("Error checking for existing mailid:", error);
              res.status(500).json({ error: "Internal Server Error" });
            });
        } else {
          res.status(401).json({ message: "Password not matched" });
        }
      } else {
        // If no workspace is found with the given wsname
        res.status(404).json({ message: "Workspace not found" });
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the database query
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

app.post("/getws", async (req, res) => {
  const mailid = req.body.mailid;

  try {
    // Use Promise.all to run both queries concurrently
    const [userWorkspaces, createdWorkspaces] = await Promise.all([
      Members.find({ mailid: mailid }, "wsname"), // Workspaces where the user is a member
      Workspace.find({ owner: mailid }, "wsname"), // Workspaces created by the user
    ]);

    const userWorkspaceNames = userWorkspaces.map(
      (workspace) => workspace.wsname
    );
    const createdWorkspaceNames = createdWorkspaces.map(
      (workspace) => workspace.wsname
    );

    res.status(200).json({
      userWorkspaces: userWorkspaceNames,
      createdWorkspaces: createdWorkspaceNames,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/team", async (req, res) => {
  const wsname = req.body.wsname;

  try {
    // Use Promise.all to run both queries concurrently
    const [userWorkspaces, createdWorkspaces] = await Promise.all([
      Members.find({ wsname: wsname }),
      Workspace.find({ wsname: wsname }),
    ]);
    const userWorkspaceEmails = userWorkspaces.map(
      (workspace) => workspace.mailid
    );
    const createdWorkspaceEmails = createdWorkspaces.map(
      (workspace) => workspace.owner
    );

    // Find user information (username, linkedin, github) for the extracted emails
    const users = await User.find(
      {
        $or: [
          { mailid: { $in: userWorkspaceEmails } },
          { mailid: { $in: createdWorkspaceEmails } },
        ],
      },
      "mailid username linkedin github"
    );

    // Prepare the response with user information and mark the owner
    const userInformation = users.reduce((result, user) => {
      result[user.mailid] = {
        username: user.username,
        linkedin: user.linkedin,
        github: user.github,
        isOwner: createdWorkspaceEmails.includes(user.mailid), // Check if the user is the owner
      };
      return result;
    }, {});
    let wsmax = 0;
    if (createdWorkspaces.length > 0) {
      wsmax = createdWorkspaces[0].maxmem;
    }

    res.status(200).json({
      userInformation: userInformation,
      wsmax: wsmax,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

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

app.post("/addtask", (req, res) => {
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
});

app.post("/gettasks", async (req, res) => {
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
});

app.post("/settaskstatus", async (req, res) => {
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
});

// Define a Mongoose model for the chat data
const Chat = mongoose.model("chats", {
  mailid: String,
  username: String,
  wsname: String,
  message: String,
  time: Date,
});

app.post("/chat", async (req, res) => {
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
});

app.post("/getchat", async (req, res) => {
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
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profile_pictures"); // Set the destination folder
  },
  filename: (req, file, cb) => {
    const filename = `${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Endpoint for uploading a profile picture
app.post(
  "/setprofilepicture",
  upload.single("profilePicture"), // Change this field name to match your HTML form field
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
