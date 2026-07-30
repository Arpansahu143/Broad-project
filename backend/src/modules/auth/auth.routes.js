import { Router } from "express";

import authController from "./auth.controller.js";

import {
  registerValidation,
  loginValidation,
  createUserValidation,
} from "./auth.validation.js";

import validateRequest from "../../middlewares/validateRequest.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import requireRole from "../../middlewares/role.middleware.js";
import { ROLES } from "../../core/constants/roles.js";

const router = Router();

router.post(
  "/register",
  registerValidation,
  validateRequest,
  authController.register
);

// ADMIN-only: create a FACULTY or ADMIN account.
// Public /register can only ever create STUDENT accounts.
router.post(
  "/admin/create-user",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  createUserValidation,
  validateRequest,
  authController.createUserByAdmin
);

router.post(
  "/login",
  loginValidation,
  validateRequest,
  authController.login
);

router.post(
  "/logout",
  authController.logout
);

export default router;