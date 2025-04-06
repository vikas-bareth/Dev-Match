const requestService = require("../services/request.service");
const ApiError = require("../utils/ApiError");

exports.sendRequest = async (req, res, next) => {
  try {
    const ALLOWED_STATUS = ["IGNORE", "INTERESTED"];
    const status = req.params.status;
    const toUserId = req.params.toUserId;
    const fromUserId = req.user._id;
    const statusMessages = {
      INTERESTED: "Connection request sent successfully!",
      IGNORE: "User ignored successfully!",
    };
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
      throw new ApiError(400, "Connection request already exists!");
    const saveConnectionReq = await requestService.saveConnectionRequest(
      fromUserId,
      toUserId,
      status
    );
    return res
      .status(200)
      .json({
        success: true,
        data: statusMessages[status] || "Action completed.",
      });
  } catch (error) {
    next(error);
  }
};
