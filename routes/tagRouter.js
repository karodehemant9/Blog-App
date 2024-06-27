const express = require("express");
const tagController = require("../controllers/tagController");
const { authenticateUser} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateUser, tagController.getTags);

module.exports = router;
