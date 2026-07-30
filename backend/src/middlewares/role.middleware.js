import ApiError from "../core/errors/ApiError.js";
import { HTTP_STATUS } from "../core/constants/httpStatus.js";

/**
 * Restricts a route to one or more roles.
 * Must run AFTER authMiddleware, since it reads req.user set there.
 *
 * Usage: router.post("/", authMiddleware, requireRole("ADMIN"), controller.create)
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      // authMiddleware should always run first; this guards against
      // a route being misconfigured and requireRole used alone.
      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "Authentication is required before role check"
        )
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "You do not have permission to perform this action"
        )
      );
    }

    next();
  };
};

export default requireRole;
