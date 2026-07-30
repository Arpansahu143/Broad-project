import { Router } from "express";

import departmentController from "./department.controller.js";

import {
    createDepartmentValidation,
    updateDepartmentValidation,
} from "./department.validation.js";

import validateRequest from "../../middlewares/validateRequest.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

/* ===========================
   Department Statistics
=========================== */

router.get(
    "/statistics",
    authMiddleware,
    departmentController.statistics
);

/* ===========================
   Department CRUD
=========================== */

// Create Department
router.post(
    "/",
    authMiddleware,
    createDepartmentValidation,
    validateRequest,
    departmentController.create
);

// Get All Departments
router.get(
    "/",
    authMiddleware,
    departmentController.getAll
);

// Get Department By ID
router.get(
    "/:id",
    authMiddleware,
    departmentController.getById
);

// Update Department
router.put(
    "/:id",
    authMiddleware,
    updateDepartmentValidation,
    validateRequest,
    departmentController.update
);

// Delete Department
router.delete(
    "/:id",
    authMiddleware,
    departmentController.delete
);

export default router;