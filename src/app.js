require("dotenv").config();
const PORT = process.env.PORT || 3000;
const fs = require("fs");
console.log("Does .env exist?", fs.existsSync(".env"));

// console.log("process.env:", process.env)
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

//Middleware
app.use(express.json());

//Signup
app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    return res.status(400).send("Missing Required Fields!");
  }

  const userObj = {
    firstName,
    lastName,
    emailId,
    password,
  };
  try {
    const user = new User(userObj);
    await user.save();
    console.log("success");
    return res.send("Data saved");
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server Error...${error?.message}`);
  }
});

//find user by email
app.get("/user", async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).send("Missing Required field");
  }
  try {
    const user = await User.find({ emailId: email });
    if (user.length === 0) {
      return res.status(404).send(`${email} not found`);
    }
    console.log("user:", user);
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
