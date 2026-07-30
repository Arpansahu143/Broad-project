import { Router } from "express";

import departmentController from "./department.controller.js";

import {
    createDepartmentValidation,
    updateDepartmentValidation,
} from "./department.validation.js";

import validateRequest from "../../middlewares/validateRequest.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import requireRole from "../../middlewares/role.middleware.js";
import { ROLES } from "../../core/constants/roles.js";

const router = Router();

/* ===========================
   Department Statistics
=========================== */

router.get(
    "/statistics",
    authMiddleware,
    requireRole(ROLES.ADMIN, ROLES.FACULTY),
    departmentController.statistics
);

/* ===========================
   Department CRUD
=========================== */

// Create Department — ADMIN only
router.post(
    "/",
    authMiddleware,
    requireRole(ROLES.ADMIN),
    createDepartmentValidation,
    validateRequest,
    departmentController.create
);

// Get All Departments — any authenticated user
router.get(
    "/",
    authMiddleware,
    departmentController.getAll
);

// Get Department By ID — any authenticated user
router.get(
    "/:id",
    authMiddleware,
    departmentController.getById
);

// Update Department — ADMIN only
router.put(
    "/:id",
    authMiddleware,
    requireRole(ROLES.ADMIN),
    updateDepartmentValidation,
    validateRequest,
    departmentController.update
);

// Delete Department — ADMIN only
router.delete(
    "/:id",
    authMiddleware,
    requireRole(ROLES.ADMIN),
    departmentController.delete
);

export default router;