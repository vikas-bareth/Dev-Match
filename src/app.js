require("dotenv").config();
const bcrypt = require("bcrypt");
const PORT = process.env.PORT || 3000;
const fs = require("fs");
console.log("Does .env exist?", fs.existsSync(".env"));
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");

//Middleware
app.use(express.json());
app.use(cookieParser());

//Signup
app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;
  try {
    validateSignUpData(req);
    //hash password
    const passwordHash = await bcrypt.hash(password, 10);
    //create db object
    const userObj = {
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
    };
    //save user
    const user = new User(userObj);
    const savedUser = await user.save();
    //generate and return jwt token
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    return res
      .status(200)
      .json({ message: "User Added successfully!", data: savedUser });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error?.message });
  }
});

//find user by email
app.get("/user", userAuth, async (req, res) => {
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

connectDB().then(() => {
  console.log("Database connection successfull.....");
  app.listen(PORT, () => {
    console.log(`SERVER LISTENING ON ${PORT}....`);
    console.log(`Link:` + `localhost:${PORT}`);
  });
});
