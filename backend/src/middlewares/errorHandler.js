import logger from "../config/logger.js";
import { HTTP_STATUS } from "../core/constants/httpStatus.js";

/**
 * Translates known Prisma error codes into a clean, safe
 * { statusCode, message } shape. Returns null if the error
 * isn't a recognized Prisma error, so the caller can fall
 * back to normal handling (ApiError, or generic 500).
 *
 * Prisma error codes reference:
 * https://www.prisma.io/docs/orm/reference/error-reference
 */
const normalizePrismaError = (err) => {
  if (!err || typeof err.code !== "string" || !err.code.startsWith("P")) {
    return null;
  }

  switch (err.code) {
    case "P2002": {
      // Unique constraint violation
      const field = err.meta?.target?.join?.(", ") || "field";
      return {
        statusCode: HTTP_STATUS.CONFLICT,
        message: `A record with this ${field} already exists`,
      };
    }
    case "P2025":
      // Record required for the operation was not found
      return {
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: "The requested record was not found",
      };
    case "P2003": {
      // Foreign key constraint failed (e.g. departmentId doesn't exist)
      const field = err.meta?.field_name || "related record";
      return {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: `Invalid reference: ${field} does not exist`,
      };
    }
    case "P2000":
      return {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: "One of the provided values is too long for its field",
      };
    default:
      return null;
  }
};

const errorHandler = (err, req, res, next) => {
  const prismaMatch = normalizePrismaError(err);

  const statusCode = prismaMatch?.statusCode || err.statusCode || 500;
  const message =
    prismaMatch?.message ||
    err.message ||
    "Internal Server Error";

  // Full details always go to the log, even when we show the
  // client a cleaned-up message.
  logger.error({
    requestId: req.requestId,
    prismaCode: err.code,
    message: err.message,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: prismaMatch ? [] : err.errors || [],
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
  });
};

export default errorHandler;
