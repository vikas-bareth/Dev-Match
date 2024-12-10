require("dotenv").config();
const bcrypt = require("bcrypt");
const PORT = process.env.PORT || 3000;
const fs = require("fs");
console.log("Does .env exist?", fs.existsSync(".env"));
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const user = require("./models/user");

//Middleware
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const requestRouter = require("./routes/request.route");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

connectDB().then(() => {
  console.log("Database connection successfull.....");
  app.listen(PORT, () => {
    console.log(`SERVER LISTENING ON ${PORT}....`);
    console.log(`Link:` + `localhost:${PORT}`);
  });
});
