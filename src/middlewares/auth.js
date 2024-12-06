const JWT = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return req.status(401).json({ message: "Please Login again!" });
    }
    const decodedObject = JWT.verify(token, "SECRET@JWT@123");
    const _id = decodedObject?._id;
    const user = await User.findById(_id);
    if (!user) {
      return req.status(404).send("User not found");
    }
    console.log(`${user.firstName} made this request..........!`);
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ error: error?.message });
  }
};

module.exports = { userAuth };
