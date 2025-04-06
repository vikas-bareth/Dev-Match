const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

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
