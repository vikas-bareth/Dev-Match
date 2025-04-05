module.exports = (err, req, res, next) => {
  console.error("Centralized error log:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error!";

  return res.status(status).json({
    success: false,
    message,
  });
};
