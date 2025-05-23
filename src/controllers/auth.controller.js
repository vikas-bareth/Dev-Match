const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");

exports.Signup = async (req, res, next) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password, age, gender } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const userObj = {
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
    };
    const user = new User(userObj);
    const savedUser = await user.save();

    const token = await savedUser.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

    return res.status(200).json({
      message: "User Added successfully!",
      data: savedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Missing required fields");
    }

    const user = await User.findOne({ emailId: email });
    if (!user) {
      throw new ApiError(400, "Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid credentials");
    }

    const token = await user.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

    return res.status(200).json({
      success: true,
      msg: "Login successful!",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", null, new Date(Date.now()));
    return res.status(200).json({ message: "Logout successfully!" });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, user, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully!",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    next(error);
  }
};
