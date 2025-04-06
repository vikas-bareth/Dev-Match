const express = require("express");
const router = express.Router();
const requestController = require("../controllers/request.controller");
const { userAuth } = require("../middlewares/auth");

router.patch(
  "/review/:status/:requestId",
  userAuth,
  requestController.reviewConnectionRequest
);
router.post("/:status/:toUserId", userAuth, requestController.sendRequest);

module.exports = router;
