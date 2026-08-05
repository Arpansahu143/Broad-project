import { body } from "express-validator";

const VALID_CATEGORIES = [
    "EXAMINATION",
    "EVENT",
    "ANNOUNCEMENT",
    "IMPORTANT",
    "PLACEMENT",
];

export const createNotificationValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 200 })
        .withMessage("Title cannot exceed 200 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("category")
        .isIn(VALID_CATEGORIES)
        .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`),
];
