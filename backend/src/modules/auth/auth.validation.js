import { body } from "express-validator";
import { ROLES } from "../../core/constants/roles.js";

export const registerValidation = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain one number"),

  body("role")
    .isIn(Object.values(ROLES))
    .withMessage("Invalid role"),
];

export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];