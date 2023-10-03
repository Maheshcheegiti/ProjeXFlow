const express = require("express");
const http = require("http");
const cors = require("cors");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
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
const OtpMap = require("./models/otpMap");

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

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(email) {
  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ mailid: email });

    if (!user) {
      // If the user doesn't exist, return a 404 error
      return { error: "User not found", status: 404 };
    }

    const otp = generateOTP(6); // Generate a 6-digit OTP

    // Check if the email exists in the database
    let otpMapEntry = await OtpMap.findOne({ maild: email });

    if (!otpMapEntry) {
      // If the email doesn't exist, create a new entry
      otpMapEntry = new OtpMap({
        maild: email,
        otp: otp,
      });
    } else {
      // If the email exists, update the OTP
      otpMapEntry.otp = otp;
    }

    await otpMapEntry.save();

    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "projexflow@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "ProjeXFlow 🎯 <projexflow@gmail.com>",
      to: email,
      subject: "Forgot Password Verification",
      text: `Hello,

Your OTP is: ${otp}

Please use this OTP to reset your password. This OTP is valid for 5 minutes.

For security reasons, please follow these guidelines:
- Do not share this OTP with anyone.
- Ensure that you are on a secure and trusted website when entering the OTP.
- If you did not request this OTP or suspect any unauthorized access, please contact our support team immediately.

For further assistance or questions, feel free to reach out to our support team at projexflow@gmail.com.

Thank you for using ProjeXFlow!

Best regards,
The ProjeXFlow Team
`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; margin: 0; padding: 0;">
        <tr>
            <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="margin: 20px auto; background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 20px;">
                            <p style="font-size: 16px; line-height: 1.5; color: #333;">
                                Hello,<br><br>
                                Your OTP is: <strong>${otp}</strong><br><br>
                                Please use this OTP to reset your password. This OTP is valid for 5 minutes.<br><br>
                                For security reasons, please follow these guidelines:<br>
                                <ul>
                                    <li>Do not share this OTP with anyone.</li>
                                    <li>Ensure that you are on a secure and trusted website when entering the OTP.</li>
                                    <li>If you did not request this OTP or suspect any unauthorized access, please contact our support team immediately.</li>
                                </ul><br>
                                For further assistance or questions, feel free to reach out to our support team at <a href="mailto:projexflow@gmail.com" style="color: #007bff; text-decoration: none;">projexflow@gmail.com</a>.<br><br>
                                Thank you for using ProjeXFlow!<br><br>
                                Best regards,<br>
                                The ProjeXFlow Team
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`,
    };

    const result = await transport.sendMail(mailOptions);
    return { emailsent: result, otp };
  } catch (error) {
    console.error("Error sending OTP:", error);
    // Handle other errors here and return appropriate status codes
    return { error: "Server error", status: 500 };
  }
}

async function shareWorkspace(body) {
  try {
    const { owner, emails, wsname, wspwd } = body;

    // Construct the email message with workspace credentials
    const subject = `💌 Workspace Invitation: ${wsname}`;
    const text = `Hello,

You have been invited to join the workspace "${wsname}" on ProjeXFlow. Here are the details:

Workspace Name: ${wsname}
Workspace Password: ${wspwd}

Please use these credentials to access the workspace.

For any assistance or questions, feel free to contact the owner at ${owner}.

Thank you for using ProjeXFlow!

Best regards,
The ProjeXFlow Team
`;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workspace Invitation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; margin: 0; padding: 0;">
        <tr>
            <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="margin: 20px auto; background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 20px;">
                            <h1 style="color: #333;">Workspace Invitation</h1>
                            <p style="font-size: 16px; line-height: 1.5; color: #333;">
                                Hello,<br><br>
                                You have been invited to join the workspace "<strong>${wsname}</strong>" on ProjeXFlow. Here are the details:<br><br>
                                <strong>Workspace Name:</strong> ${wsname}<br>
                                <strong>Workspace Password:</strong> ${wspwd}<br><br>
                                Please use these credentials to access the workspace.<br><br>
                                For any assistance or questions, feel free to contact the owner at <a href="mailto:${owner}" style="color: #007bff; text-decoration: none;">${owner}</a>.<br><br>
                                Thank you for using ProjeXFlow!<br><br>
                                Best regards,<br>
                                The ProjeXFlow Team
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "projexflow@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // Send the email to each recipient in the emails array
    const promises = emails.map(async (email) => {
      const mailOptions = {
        from: "ProjeXFlow 🎯 <projexflow@gmail.com>",
        to: email,
        subject: subject,
        text: text,
        html: html,
      };

      const result = await transport.sendMail(mailOptions);
      return { email: email, emailsent: result };
    });

    // Wait for all emails to be sent
    const emailResults = await Promise.all(promises);

    return { emailResults };
  } catch (error) {
    console.error("Error sending workspace invitations:", error);
    // Handle other errors here and return appropriate status codes
    return { error: "Server error", status: 500 };
  }
}

async function sendMessage(name, mailid, msg) {
  try {
    // Create the plain text version of the message
    const textMessage = `
      Message from ProjeXFlow Contact Form

      Name: ${name}
      Email: ${mailid}

      Message:
      ${msg}
    `;

    // Create the HTML version of the message
    const htmlMessage = `
      <html>
        <body>
          <h2>Message from ProjeXFlow Contact Form</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${mailid}</p>
          <p><strong>Message:</strong></p>
          <p>${msg}</p>
        </body>
      </html>
    `;

    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "projexflow@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "ProjeXFlow 🎯 <projexflow@gmail.com>",
      to: "ramahesh024@gmail.com", // Change this to the recipient's email address
      subject: "Message from ProjeXFlow Contact Form",
      text: textMessage, // Plain text version
      html: htmlMessage, // HTML version
    };

    const result = await transport.sendMail(mailOptions);
    return { messagesent: result };
  } catch (error) {
    console.error("Error sending message:", error);
    // Handle other errors here and return appropriate status codes
    return { error: "Server error", status: 500 };
  }
}

function generateOTP(length) {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

// Endpoint for sending OTP
app.post("/sendotp", async (req, res) => {
  const email = req.body.mailid;

  try {
    const result = await sendMail(email);

    if (result.error) {
      // Handle the error and send an appropriate response with status code
      return res.status(result.status).json({ error: result.error });
    }

    // If OTP is sent successfully, return a success response
    res
      .status(200)
      .json({ message: "OTP sent successfully", emailsent: result.emailsent });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/shareworkspace", async (req, res) => {
  const body = req.body;

  try {
    const result = await shareWorkspace(body);
    console.log(result);
    if (result.error) {
      // Handle the error and send an appropriate response with status code
      return res.status(result.status).json({ error: result.error });
    }

    // If OTP is sent successfully, return a success response
    res.status(200).json({ message: "Msg sent successfully", res: result });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/sendmesg", async (req, res) => {
  const { name, mailid, msg } = req.body;

  try {
    const result = await sendMessage(name, mailid, msg);

    if (result.error) {
      // Handle the error and send an appropriate response with status code
      return res.status(result.status).json({ error: result.error });
    }

    // If the message is sent successfully, return a success response
    res.status(200).json({
      message: "Message sent successfully",
      messagesent: result.messagesent,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Schedule a job to remove OTPs older than 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    // Remove OTPs older than 5 minutes
    await OtpMap.deleteMany({ createdAt: { $lt: fiveMinutesAgo } });
    console.log("Removed expired OTPs");
  } catch (error) {
    console.error("Error removing expired OTPs:", error);
  }
});

// Endpoint for checking OTP validity
app.post("/checkotp", async (req, res) => {
  const { mailid, otp } = req.body;

  try {
    // Check if the OTP exists in the database
    const otpMapEntry = await OtpMap.findOne({ maild: mailid });

    if (!otpMapEntry) {
      // If the OTP entry doesn't exist, it has expired or is invalid
      return res.status(404).json({ error: "OTP has expired or not found" });
    }

    if (otpMapEntry.otp === otp) {
      // If the OTP matches, it's valid
      return res.status(200).json({ message: "OTP is valid" });
    } else {
      // If the OTP doesn't match, it's invalid
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error checking OTP:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server using the HTTP server instance
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
