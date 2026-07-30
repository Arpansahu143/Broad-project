import { body } from "express-validator";

export const createFacultyValidation = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required"),

  body("employeeId")
    .notEmpty()
    .withMessage("Employee ID is required"),

  body("departmentId")
    .notEmpty()
    .withMessage("Department ID is required"),

  body("designation")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Designation cannot exceed 100 characters"),

  body("phone")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),
];

export const updateFacultyValidation = [
  body("departmentId")
    .optional()
    .notEmpty()
    .withMessage("Department ID cannot be empty"),

  body("designation")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Designation cannot exceed 100 characters"),

  body("phone")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),
];
