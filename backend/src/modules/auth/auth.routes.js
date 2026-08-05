import { Router } from "express";

import authController from "./auth.controller.js";

import {
  registerValidation,
  loginValidation,
  createUserValidation,
  changePasswordValidation,
} from "./auth.validation.js";

import validateRequest from "../../middlewares/validateRequest.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import requireRole from "../../middlewares/role.middleware.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";
import { ROLES } from "../../core/constants/roles.js";

const router = Router();

router.post(
  "/register",
  authLimiter,
  registerValidation,
  validateRequest,
  authController.register
);

// ADMIN-only: create a FACULTY or ADMIN account directly, without going
// through public registration. Public /register can also create any
// role (see auth.service.js note on that tradeoff) — this endpoint
// exists separately so an Admin can provision accounts without the
// new user having to self-register.
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
  authLimiter,
  loginValidation,
  validateRequest,
  authController.login
);

router.post(
  "/logout",
  authController.logout
);

router.post(
  "/change-password",
  authLimiter,
  authMiddleware,
  changePasswordValidation,
  validateRequest,
  authController.changePassword
);

export default router;