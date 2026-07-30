import { Router } from "express";

import facultyController from "./faculty.controller.js";

import {
  createFacultyValidation,
  updateFacultyValidation,
} from "./faculty.validation.js";

import validateRequest from "../../middlewares/validateRequest.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import requireRole from "../../middlewares/role.middleware.js";
import { ROLES } from "../../core/constants/roles.js";

const router = Router();

/* ===========================
   Faculty Profile
=========================== */

// Logged-in Faculty Profile
router.get(
  "/profile",
  authMiddleware,
  facultyController.getProfile
);

/* ===========================
   Faculty CRUD
=========================== */

// Create Faculty — ADMIN only
router.post(
  "/",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  createFacultyValidation,
  validateRequest,
  facultyController.create
);

// Get All Faculty — ADMIN only
router.get(
  "/",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  facultyController.getAll
);

// Get Faculty By ID — ADMIN only
router.get(
  "/:id",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  facultyController.getById
);

// Update Faculty — ADMIN only
router.put(
  "/:id",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  updateFacultyValidation,
  validateRequest,
  facultyController.update
);

// Delete Faculty — ADMIN only
router.delete(
  "/:id",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  facultyController.delete
);

export default router;
