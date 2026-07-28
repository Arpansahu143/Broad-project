import { Router } from "express";

import studentController from "./student.controller.js";

import {
  createStudentValidation,
  updateStudentValidation,
} from "./student.validation.js";

import validateRequest from "../../middlewares/validateRequest.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

/* ===========================
   Student Profile
=========================== */

// Logged-in Student Profile
router.get(
  "/profile",
  authMiddleware,
  studentController.getProfile
);

/* ===========================
   Student CRUD
=========================== */

// Create Student
router.post(
  "/",
  createStudentValidation,
  validateRequest,
  studentController.create
);

// Get All Students
router.get(
  "/",
  studentController.getAll
);

// Get Student By ID
router.get(
  "/:id",
  studentController.getById
);

// Update Student
router.put(
  "/:id",
  updateStudentValidation,
  validateRequest,
  studentController.update
);

// Delete Student
router.delete(
  "/:id",
  studentController.delete
);

export default router;