import { body } from "express-validator";

export const markAttendanceValidation = [

    body("courseId")
        .trim()
        .notEmpty()
        .withMessage("courseId is required")
        .isUUID()
        .withMessage("courseId must be a valid UUID"),

    body("date")
        .trim()
        .notEmpty()
        .withMessage("date is required")
        .isISO8601()
        .withMessage("date must be a valid date (YYYY-MM-DD)"),

    body("records")
        .isArray({ min: 1 })
        .withMessage("records must be a non-empty array"),

    body("records.*.studentId")
        .trim()
        .notEmpty()
        .withMessage("Each record needs a studentId")
        .isUUID()
        .withMessage("studentId must be a valid UUID"),

    body("records.*.status")
        .trim()
        .notEmpty()
        .withMessage("Each record needs a status")
        .isIn(["PRESENT", "ABSENT", "LATE"])
        .withMessage("status must be PRESENT, ABSENT, or LATE"),

];
