const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { isValidObjectId } = require("mongoose");

exports.checkUserExistence = async (userId) => {
  try {
    const result = await User.findById(userId);
    if (!result) {
      return { success: false, message: "User does not exists!" };
    }
    return { success: true, data: result };
  } catch (error) {
    throw error;
  }
};

exports.checkExistingConnectionRequest = async (fromUserId, toUserId) => {
  try {
    const result = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (!result) {
      return { success: false, message: "No connection exists" };
    }
    return { success: true, data: result };
  } catch (error) {
    throw error;
  }
};

exports.validateRequestUserId = async (fromUserId, toUserId) => {
  try {
    if (fromUserId.equals(toUserId)) {
      return { success: false, message: "Cannot send request to same user!" };
    }
    if (!isValidObjectId(fromUserId) || !isValidObjectId(toUserId)) {
      return {
        success: false,
        message: "Invalid Id!",
      };
    }
    const fromUserExists = await this.checkUserExistence(fromUserId);
    const toUserExists = await this.checkUserExistence(toUserId);
    if (!fromUserExists.success || !toUserExists.success) {
      return { success: false, message: "User does not exists!" };
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

exports.saveConnectionRequest = async (fromUserId, toUserId, status) => {
  try {
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const newConnection = await connectionRequest.save();
    return newConnection;
  } catch (error) {
    throw error;
  }
};

exports.connectionRequestFindAndUpdate = async (
  requestId,
  loggedInUserId,
  status
) => {
  try {
    if (!isValidObjectId(requestId) || !isValidObjectId(loggedInUserId)) {
      return {
        success: false,
        type: "INVALID_DATA",
        message: "Invalid Id!",
      };
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "INTERESTED",
    });
    if (!connectionRequest) {
      return {
        success: false,
        type: "NOT_FOUND",
        message: "No request found",
      };
    }
    connectionRequest.status = status;
    await connectionRequest.save();
    return {
      success: true,
      message: "connection request updated!",
      data: connectionRequest,
    };
  } catch (error) {}
};
