const express = require("express");
const router = express.Router();
const teamController = require("../controllers/TeamController");

router.post("/team", teamController.Teams);

module.exports = router;
