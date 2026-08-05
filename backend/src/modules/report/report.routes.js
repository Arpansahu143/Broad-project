import { Router } from "express";

import reportController from "./report.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import requireRole from "../../middlewares/role.middleware.js";
import { ROLES } from "../../core/constants/roles.js";

const router = Router();

router.get(
    "/summary",
    authMiddleware,
    requireRole(ROLES.ADMIN),
    reportController.getSummary
);

export default router;
