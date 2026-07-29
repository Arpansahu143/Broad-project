import { body } from "express-validator";

export const createDepartmentValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Department name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Department name must be between 2 and 100 characters"),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Department code is required")
        .isLength({ min: 2, max: 10 })
        .withMessage("Department code must be between 2 and 10 characters")
        .isAlphanumeric()
        .withMessage("Department code must contain only letters and numbers"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

];

export const updateDepartmentValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Department name cannot be empty")
        .isLength({ min: 2, max: 100 })
        .withMessage("Department name must be between 2 and 100 characters"),

    body("code")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Department code cannot be empty")
        .isLength({ min: 2, max: 10 })
        .withMessage("Department code must be between 2 and 10 characters")
        .isAlphanumeric()
        .withMessage("Department code must contain only letters and numbers"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

];