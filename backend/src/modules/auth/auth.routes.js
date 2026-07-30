import { Router } from "express";

import authController from "./auth.controller.js";

import {
  registerValidation,
  loginValidation,
} from "./auth.validation.js";

import validateRequest from "../../middlewares/validateRequest.js";

const router = Router();

router.post(
  "/register",
  registerValidation,
  validateRequest,
  authController.register
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