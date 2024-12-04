require("dotenv").config();
const PORT = process.env.PORT || 3000;
const fs = require("fs");
console.log("Does .env exist?", fs.existsSync(".env"));

// console.log("process.env:", process.env);
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

//Signup
app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Vikas",
    lastName: "Bareth",
    emailId: "vikas@email.com",
    password: "vikas",
  };
  const user = new User(userObj);
  await user.save();
  console.log("success");
  res.send("Data saved");
});

connectDB().then(() => {
  console.log("Database connection successfull.....");
  app.listen(PORT, () => {
    console.log(`SERVER LISTENING ON ${PORT}....`);
    console.log(`Link:` + `localhost:${PORT}`);
  });
});
