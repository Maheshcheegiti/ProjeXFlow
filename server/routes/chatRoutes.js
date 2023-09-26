const express = require("express");
const router = express.Router();
const chatController = require("../controllers/ChatController");

router.post("/chat", chatController.Chats);
router.post("/getchat", chatController.getChat);

module.exports = router;
