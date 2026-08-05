import { body } from "express-validator";

export const createCourseValidation = [

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Course code is required")
        .isLength({ min: 2, max: 15 })
        .withMessage("Course code must be between 2 and 15 characters"),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Course name is required")
        .isLength({ min: 2, max: 150 })
        .withMessage("Course name must be between 2 and 150 characters"),

    body("credits")
        .notEmpty()
        .withMessage("Credits is required")
        .isInt({ min: 1, max: 10 })
        .withMessage("Credits must be an integer between 1 and 10"),

    body("departmentId")
        .trim()
        .notEmpty()
        .withMessage("departmentId is required")
        .isUUID()
        .withMessage("departmentId must be a valid UUID"),

    body("facultyId")
        .optional()
        .trim()
        .isUUID()
        .withMessage("facultyId must be a valid UUID"),

];

export const updateCourseValidation = [

    body("code")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Course code cannot be empty")
        .isLength({ min: 2, max: 15 })
        .withMessage("Course code must be between 2 and 15 characters"),

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Course name cannot be empty")
        .isLength({ min: 2, max: 150 })
        .withMessage("Course name must be between 2 and 150 characters"),

    body("credits")
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage("Credits must be an integer between 1 and 10"),

    body("departmentId")
        .optional()
        .trim()
        .isUUID()
        .withMessage("departmentId must be a valid UUID"),

    body("facultyId")
        .optional({ nullable: true })
        .trim()
        .isUUID()
        .withMessage("facultyId must be a valid UUID"),

];
