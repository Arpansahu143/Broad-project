import { body } from "express-validator";

export const createExamValidation = [

    body("courseId")
        .trim()
        .notEmpty()
        .withMessage("courseId is required")
        .isUUID()
        .withMessage("courseId must be a valid UUID"),

    body("title")
        .trim()
        .notEmpty()
        .withMessage("title is required")
        .isLength({ max: 150 })
        .withMessage("title must be under 150 characters"),

    body("examType")
        .trim()
        .notEmpty()
        .withMessage("examType is required")
        .isIn(["QUIZ", "ASSIGNMENT", "MIDTERM", "FINAL"])
        .withMessage("examType must be QUIZ, ASSIGNMENT, MIDTERM, or FINAL"),

    body("maxMarks")
        .notEmpty()
        .withMessage("maxMarks is required")
        .isFloat({ min: 1 })
        .withMessage("maxMarks must be a positive number"),

    body("examDate")
        .trim()
        .notEmpty()
        .withMessage("examDate is required")
        .isISO8601()
        .withMessage("examDate must be a valid date (YYYY-MM-DD)"),

];

export const enterGradesValidation = [

    body("records")
        .isArray({ min: 1 })
        .withMessage("records must be a non-empty array"),

    body("records.*.studentId")
        .trim()
        .notEmpty()
        .withMessage("Each record needs a studentId")
        .isUUID()
        .withMessage("studentId must be a valid UUID"),

    body("records.*.marksObtained")
        .notEmpty()
        .withMessage("Each record needs marksObtained")
        .isFloat({ min: 0 })
        .withMessage("marksObtained must be zero or a positive number"),

    body("records.*.remarks")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage("remarks must be under 500 characters"),

];
