const express = require("express");
const { signupUserValidators, loginUserValidators } = require("../util/validators");
const { handleValidationError } = require("../util/handleValidationError");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/users", signupUserValidators, handleValidationError, userController.signupUser);
router.post("/userAuthentication", loginUserValidators, handleValidationError, userController.loginUser);

module.exports = router;
