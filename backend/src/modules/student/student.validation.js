import { body } from "express-validator";

export const createStudentValidation = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required"),

  body("studentId")
    .notEmpty()
    .withMessage("Student ID is required"),

  body("departmentId")
    .notEmpty()
    .withMessage("Department ID is required"),

  body("semester")
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8"),

  body("phone")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),

  body("cgpa")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("CGPA must be between 0 and 10"),

  body("attendance")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Attendance must be between 0 and 100"),
];

export const updateStudentValidation = [
  body("departmentId")
    .optional()
    .notEmpty()
    .withMessage("Department ID cannot be empty"),

  body("semester")
    .optional()
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8"),

  body("phone")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),

  body("cgpa")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("CGPA must be between 0 and 10"),

  body("attendance")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Attendance must be between 0 and 100"),
];