const express = require("express");
const asyncHandler = require("express-async-handler");

const { registerUser, loginUser } = require("../controllers/AuthController");

const router = express.Router();

// Register a new user
router.post("/register", asyncHandler(registerUser));

// Login an existing user
router.post("/login", asyncHandler(loginUser));

module.exports = router;
