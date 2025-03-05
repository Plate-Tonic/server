const express = require("express");
const asyncHandler = require("express-async-handler");
const { getSecurityQuestions, registerUser, loginUser, getSecurityQuestion, answerSecurityQuestion, resetPassword } = require("../controllers/AuthController");

const router = express.Router();

// Get security questions
router.get("/questions", asyncHandler(getSecurityQuestions));

// Register a new user
router.post("/register", asyncHandler(registerUser));

// Login an existing user
router.post("/login", asyncHandler(loginUser));

// Get security question for user
router.post("/question", asyncHandler(getSecurityQuestion));

// Answer security question
router.post("/answer", asyncHandler(answerSecurityQuestion));

// Reset password
router.post("/reset-password", asyncHandler(resetPassword));

module.exports = router;
