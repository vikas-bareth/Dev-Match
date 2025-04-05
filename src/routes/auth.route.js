const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const userController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", userController.Signup);

router.post("/login", userController.login);

module.exports = router;
