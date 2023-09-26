const express = require("express");
const router = express.Router();
const taskController = require("../controllers/TaskController");

router.post("/addtask", taskController.addTask);
router.post("/gettasks", taskController.getTask);
router.post("/settaskstatus", taskController.setTaskStatus);

module.exports = router;
