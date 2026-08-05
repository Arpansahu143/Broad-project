import { Router } from "express";

import attendanceController from "./attendance.controller.js";
import { markAttendanceValidation } from "./attendance.validation.js";

import validateRequest from "../../middlewares/validateRequest.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import requireRole from "../../middlewares/role.middleware.js";
import { ROLES } from "../../core/constants/roles.js";

const router = Router();

// STUDENT self-service — must come before /:courseId to avoid being
// captured by the param route.
router.get(
    "/my",
    authMiddleware,
    requireRole(ROLES.STUDENT),
    attendanceController.getMy
);

// FACULTY marks attendance for their own course. ADMIN can override.
router.post(
    "/",
    authMiddleware,
    requireRole(ROLES.FACULTY, ROLES.ADMIN),
    markAttendanceValidation,
    validateRequest,
    attendanceController.mark
);

// FACULTY/ADMIN view a course's attendance. Optional ?date=YYYY-MM-DD.
router.get(
    "/:courseId",
    authMiddleware,
    requireRole(ROLES.FACULTY, ROLES.ADMIN),
    attendanceController.getByCourse
);

export default router;
