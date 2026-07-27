import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error({
    requestId: req.requestId,
    message: err.message,
    stack: err.stack,
  });

  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
  });
};

export default errorHandler;