const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", authController.Signup);

router.post("/login", authController.login);

module.exports = router;
