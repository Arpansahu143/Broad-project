import { Router } from "express";

import examController from "./exam.controller.js";
import { createExamValidation, enterGradesValidation } from "./exam.validation.js";

import validateRequest from "../../middlewares/validateRequest.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import requireRole from "../../middlewares/role.middleware.js";
import { ROLES } from "../../core/constants/roles.js";

const router = Router();

// STUDENT self-service — must come before /:examId routes.
router.get(
    "/my",
    authMiddleware,
    requireRole(ROLES.STUDENT),
    examController.getMy
);

// FACULTY/ADMIN — list exams for a course. Must come before /:examId
// since "course" would otherwise be captured as an examId.
router.get(
    "/course/:courseId",
    authMiddleware,
    requireRole(ROLES.FACULTY, ROLES.ADMIN),
    examController.getByCourse
);

// FACULTY creates for their own course. ADMIN can override.
router.post(
    "/",
    authMiddleware,
    requireRole(ROLES.FACULTY, ROLES.ADMIN),
    createExamValidation,
    validateRequest,
    examController.create
);

// Bulk grade entry — same shape as bulk attendance marking.
router.post(
    "/:examId/grades",
    authMiddleware,
    requireRole(ROLES.FACULTY, ROLES.ADMIN),
    enterGradesValidation,
    validateRequest,
    examController.enterGrades
);

router.get(
    "/:examId/grades",
    authMiddleware,
    requireRole(ROLES.FACULTY, ROLES.ADMIN),
    examController.getGrades
);

export default router;
