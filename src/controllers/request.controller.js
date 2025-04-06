const { isValidObjectId } = require("mongoose");
const requestService = require("../services/request.service");
const ApiError = require("../utils/ApiError");
const ALLOWED_STATUS = ["ignore", "interested"];

exports.sendRequest = async (req, res, next) => {
  try {
    const status = req.params.status;
    const toUserId = req.params.toUserId;
    const fromUserId = req.user._id;
    if (!status || !toUserId || !fromUserId) {
      throw new ApiError(400, "Missing required parameters!");
    }
    if (!ALLOWED_STATUS.includes(status))
      throw new ApiError(400, `Invalid Status: ${status}`);
    const validateData = await requestService.validateRequestUserId(
      fromUserId,
      toUserId
    );
    if (!validateData.success) {
      throw new ApiError(400, validateData.message);
    }
    const connectionExists =
      await requestService.checkExistingConnectionRequest(fromUserId, toUserId);
    if (connectionExists.success)
      throw new ApiError(400, "Conneciton request already exists!");
    return res.status(200).json({ success: true, data: connectionExists });
  } catch (error) {
    next(error);
  }
};
