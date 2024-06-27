const express = require("express");
const { validateGetPostById, validateUpdatePostById, validateDeletePostById, createPostValidators, tagValidators } = require("../util/validators");
const { handleValidationError } = require("../util/handleValidationError");
const postController = require("../controllers/postController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticateUser,
  postController.getPosts
);


router.get(
  "/:id",
  authenticateUser,
  validateGetPostById,
  handleValidationError,
  postController.getPostById
);


router.post(
  "/",
  authenticateUser,
  createPostValidators,
  tagValidators,
  handleValidationError,
  postController.createPost
);


router.put(
  "/:id",
  authenticateUser,
  validateUpdatePostById,
  handleValidationError,
  postController.updatePostById
);


router.delete(
  "/:id",
  authenticateUser,
  validateDeletePostById,
  handleValidationError,
  postController.deletePostById
);

module.exports = router;
