require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

//Middleware
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const requestRouter = require("./routes/request.route");

app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ message: "Welcome to dev-match backend application!" });
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

connectDB().then(() => {
  console.log("Database connection successfull.....");
  app.listen(PORT, () => {
    console.log(`SERVER LISTENING ON ${PORT}....`);
    console.log(`Link:` + `http://localhost:${PORT}`);
  });
});
