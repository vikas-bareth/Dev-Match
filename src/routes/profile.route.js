const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/profile", (req, res) => {});

//find user by email
router.get("/user", userAuth, async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).send("Missing Required field");
  }
  try {
    const user = await User.find({ emailId: email });
    if (user.length === 0) {
      return res.status(404).send(`${email} not found`);
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
});

module.exports = router;
