const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

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

exports.getUserAllConnectionRequests = async (userId, status) => {
  try {
    const userConnectionRequests = await ConnectionRequest.find({
      toUserId: userId,
      status: status,
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "photoUrl",
    ]);
    return { success: true, userConnectionRequests };
  } catch (error) {
    throw error;
  }
};

exports.getUserConnections = async (userId, status) => {
  try {
    const userConnections = await ConnectionRequest.find({
      $or: [
        { toUserId: userId, status },
        { fromUserId: userId, status },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "photoUrl",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "photoUrl",
      ]);
    return { success: true, data: userConnections };
  } catch (error) {
    next(error);
  }
};

exports.getUserConnectionAll = async (userId) => {
  try {
    return await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).select("fromUserId toUserId");
  } catch (error) {
    throw error;
  }
};

exports.getFeedUsers = async (
  hideUsersFromFeed,
  loggedInUserId,
  page,
  limit
) => {
  try {
    let skip = (page - 1) * limit;
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUserId } },
      ],
    })
      .select([
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "photoUrl",
        "about",
      ])
      .skip(skip)
      .limit(limit);
    return users;
  } catch (error) {
    throw error;
  }
};
