import ApiError from "../core/errors/ApiError.js";
import { HTTP_STATUS } from "../core/constants/httpStatus.js";
import { verifyAccessToken } from "../core/utils/jwt.js";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Access token is required"
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    next(
      new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid or expired token"
      )
    );
  }
};

export default authMiddleware;