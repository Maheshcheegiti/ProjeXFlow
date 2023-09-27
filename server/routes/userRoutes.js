const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

// Define user registration route
router.post("/signup", userController.signUp);
router.post("/login", userController.logIn);
router.post("/checkmail", userController.checkMail);
router.post("/changeusername", userController.changeUserName);
router.post("/changelinkedin", userController.changeLinkedIn);
router.post("/changegithub", userController.changeGitHub);
router.post("/changepassword", userController.changePassword);
router.post("/newpassword", userController.setNewPassword);

module.exports = router;
