const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
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
};

exports.logIn = async (req, res) => {
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
};

exports.checkMail = (req, res) => {
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
};

exports.changeUserName = async (req, res) => {
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
};

exports.changeLinkedIn = async (req, res) => {
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
};

exports.changeGitHub = async (req, res) => {
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
};

exports.changePassword = async (req, res) => {
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
};
