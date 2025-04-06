const userService = require("../services/user.service");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

exports.getUserByEmail = async (req, res, next) => {
  try {
    const email = req.body.email;
    if (!email) {
      throw new ApiError(400, "Missing required fields");
    }
    const user = await userService.findUserByEmail(email);
    if (user.length === 0 || !user) {
      throw new ApiError(404, `${email} not found`);
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.findAllUser();

    if (!users.success) {
      throw new ApiError(400, "Failed to get all users!");
    }
    return res.status(200).json({
      success: users.success,
      data: users.data,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new ApiError(400, "Missing required field!");
    }
    const user = await userService.findUserById(userId);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUserById = async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    if (!userId) {
      throw new ApiError(400, "Missing required field!");
    }
    const user = await userService.deleteUserById(userId);
    if (!user.success) {
      throw new ApiError(400, user.message);
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: user.data,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserById = async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    const data = req.body;
    if (!userId || !data) {
      throw new ApiError(400, "Missing required data!");
    }
    const result = await userService.updateUser(userId, data);
    return res.status(200).json({
      success: result.success,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserConnectionRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const status = req.query.status || "INTERESTED";
    const userAllConnectionRequests =
      await userService.getUserAllConnectionRequests(userId, status);
    return res
      .status(200)
      .json({ success: true, requests: userAllConnectionRequests });
  } catch (error) {
    next(error);
  }
};

exports.getUserConnections = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const status = "ACCEPTED";
    const connectionRequests = await userService.getUserConnections(
      loggedInUserId,
      status
    );
    const data = connectionRequests.data.map((connection) => {
      if (connection.fromUserId._id.toString() === loggedInUserId.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
