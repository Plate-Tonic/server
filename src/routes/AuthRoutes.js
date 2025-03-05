const express = require("express");
const asyncHandler = require("express-async-handler");

const { registerUser, loginUser } = require("../controllers/AuthController");

const router = express.Router();

// Register a new user
router.post("/register", asyncHandler(registerUser));

// Login an existing user
router.post("/login", asyncHandler(loginUser));

// Get security question for user
router.post("/question", asyncHandler(getSecurityQuestion));

// Answer security question
router.post("/answer", asyncHandler(answerSecurityQuestion));

// Reset password
router.post("/reset", asyncHandler(resetPassword));

module.exports = router;
