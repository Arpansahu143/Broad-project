import { validationResult } from "express-validator";
import ApiError from "../core/errors/ApiError.js";
import { HTTP_STATUS } from "../core/constants/httpStatus.js";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Validation failed",
        errors.array()
      )
    );
  }

  next();
};

export default validateRequest;