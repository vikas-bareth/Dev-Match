const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const userController = require("../controllers/user.controller");

const router = express.Router();

//find user by email
router.get("/", userAuth, userController.getUserByEmail);
router.get("/id/:id", userAuth, userController.getUserById);
router.patch("/", userAuth, userController.updateUserById);
router.delete("/", userAuth, userController.deleteUserById);
//get all users
router.get("/all", userAuth, userController.getAllUsers);

router.get("/requests", userAuth, userController.getUserConnectionRequests);

module.exports = router;
