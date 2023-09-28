const express = require("express");
const router = express.Router();
const worspaceController = require("../controllers/WorkspaceController");

router.post("/createws", worspaceController.createWS);
router.post("/getwsstatus", worspaceController.getWsStatus);
router.post("/getworkspacedetails", worspaceController.getWsDetails);
router.post("/joinws", worspaceController.joinWS);
router.post("/getws", worspaceController.getWS);

module.exports = router;
