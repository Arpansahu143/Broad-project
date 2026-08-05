import { Router } from "express";

import courseController from "./course.controller.js";

import {
    createCourseValidation,
    updateCourseValidation,
} from "./course.validation.js";

import validateRequest from "../../middlewares/validateRequest.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import requireRole from "../../middlewares/role.middleware.js";
import { ROLES } from "../../core/constants/roles.js";

const router = Router();

/* ===========================
   My Courses (self-service)
   FACULTY -> courses they teach
   STUDENT -> courses they're enrolled in
=========================== */

router.get(
    "/my",
    authMiddleware,
    requireRole(ROLES.FACULTY, ROLES.STUDENT),
    courseController.myCourses
);

/* ===========================
   Enrollment (self-service, STUDENT only)
=========================== */

router.post(
    "/:id/enroll",
    authMiddleware,
    requireRole(ROLES.STUDENT),
    courseController.enroll
);

router.delete(
    "/:id/enroll",
    authMiddleware,
    requireRole(ROLES.STUDENT),
    courseController.unenroll
);

/* ===========================
   Course CRUD
=========================== */

// Create Course — ADMIN only
router.post(
    "/",
    authMiddleware,
    requireRole(ROLES.ADMIN),
    createCourseValidation,
    validateRequest,
    courseController.create
);

// Get All Courses — any authenticated user
router.get(
    "/",
    authMiddleware,
    courseController.getAll
);

// Get Course By ID — any authenticated user
router.get(
    "/:id",
    authMiddleware,
    courseController.getById
);

// Update Course — ADMIN only
router.put(
    "/:id",
    authMiddleware,
    requireRole(ROLES.ADMIN),
    updateCourseValidation,
    validateRequest,
    courseController.update
);

// Delete Course — ADMIN only
router.delete(
    "/:id",
    authMiddleware,
    requireRole(ROLES.ADMIN),
    courseController.delete
);

export default router;
