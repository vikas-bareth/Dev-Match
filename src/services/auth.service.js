const User = require("../models/user");

exports.createuser = async (userObj) => {
  try {
    const user = new User(userObj);
    return await user.save();
  } catch (error) {
    throw Error("Error in create user:", error.message);
  }
};

exports.findUserByEmail = async (email) => {
  try {
    return await User.findOne({ emailId: email });
  } catch (error) {
    throw Error("Error in find user by email", error.message);
  }
};
