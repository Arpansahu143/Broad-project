import { Router } from "express";

import notificationController from "./notification.controller.js";
import { createNotificationValidation } from "./notification.validation.js";

import validateRequest from "../../middlewares/validateRequest.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import requireRole from "../../middlewares/role.middleware.js";
import { ROLES } from "../../core/constants/roles.js";

const router = Router();

// Create — ADMIN only (broadcast announcements)
router.post(
    "/",
    authMiddleware,
    requireRole(ROLES.ADMIN),
    createNotificationValidation,
    validateRequest,
    notificationController.create
);

// Read — any authenticated user (STUDENT, FACULTY, ADMIN)
router.get(
    "/",
    authMiddleware,
    notificationController.getAll
);

// Delete — ADMIN only
router.delete(
    "/:id",
    authMiddleware,
    requireRole(ROLES.ADMIN),
    notificationController.delete
);

export default router;
