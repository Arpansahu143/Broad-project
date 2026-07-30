import logger from "../config/logger.js";

const requestLogger = (req, res, next) => {
  logger.info({
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  next();
};

export default requestLogger;