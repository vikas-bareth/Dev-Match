const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authController = require("../controllers/auth.controller");
const { userAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", authController.Signup);

router.post("/login", authController.login);

router.get("/user", userAuth, authController.getUser);

router.patch("/user", userAuth, authController.updateUser);

router.get("/logout", authController.logout);

module.exports = router;
