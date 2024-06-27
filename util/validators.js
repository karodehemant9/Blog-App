const { body, param, header, validationResult } = require("express-validator");

const validateGetPostById = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Post ID must be a positive integer"),
];

const validateUpdatePostById = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Post ID must be a positive integer"),
];

const validateDeletePostById = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Post ID must be a positive integer"),
];

const createPostValidators = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
];

const tagValidators = [
  body("tags")
    .isArray()
    .withMessage("should be an array")
    .isLength({ min: 1 })
    .withMessage("At least one tag is required"),
  body("tags.*")
    .optional()
    .isString()
    .withMessage("Tag name must be a valid string"),
];

const signupUserValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a valid string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginUserValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

module.exports = {
  validateGetPostById,
  validateUpdatePostById,
  validateDeletePostById,
  createPostValidators,
  tagValidators,
  signupUserValidators,
  loginUserValidators,
};
