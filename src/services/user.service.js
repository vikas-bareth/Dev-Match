const User = require("../models/user");

exports.findAllUser = async () => {
  try {
    const result = await User.find({});
    return { success: true, data: result };
  } catch (error) {
    throw error;
  }
};

exports.findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ emailId: email });
    return user;
  } catch (error) {
    throw Error("Error in find user by email", error.message);
  }
};

exports.findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw error;
  }
};

exports.deleteUserById = async (userId) => {
  try {
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      return { success: false, message: "User does not exists" };
    }
    return { success: true, data: result };
  } catch (error) {
    throw error;
  }
};

exports.updateUser = async (userId, data) => {
  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
    });
    return { success: true, data: user };
  } catch (error) {
    throw error;
  }
};
