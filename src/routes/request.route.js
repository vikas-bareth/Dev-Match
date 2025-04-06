const express = require("express");
const router = express.Router();
const requestController = require("../controllers/request.controller");
const { userAuth } = require("../middlewares/auth");

router.post("/:status/:toUserId", userAuth, requestController.sendRequest);

module.exports = router;
