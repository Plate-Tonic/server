const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { User } = require("../models/UserModel");
const { securityQuestions } = require("../utils/securityQuestions");

// Get security questions
const getSecurityQuestions = asyncHandler(async (req, res) => {
    try {
        res.status(200).json({ securityQuestions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Register new user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, securityQuestion, securityAnswer, macroTracker } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Check password length
    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    // Hash password and security answer before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(securityAnswer, 10);

    // Create and store new user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        securityQuestion,
        securityAnswer: hashedAnswer,
        macroTracker: macroTracker || {}
    });

    // Success message
    res.status(201).json({ message: "User registered successfully", data: user });
});

// Login existing user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Compare password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Success message
    res.json({ message: "Login successful", token });
});

// Get security question for user
const getSecurityQuestion = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Success message
    res.status(200).json({ message: "Security question retrieved", securityQuestion: user.securityQuestion });
});

// Answer security question
const answerSecurityQuestion = asyncHandler(async (req, res) => {
    const { email, securityAnswer } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Compare security answer with hashed security answer in database
    const isAnswerValid = await bcrypt.compare(securityAnswer, user.securityAnswer);
    if (!isAnswerValid) {
        return res.status(400).json({ message: "Incorrect answer" });
    }

    // Success message
    res.status(200).json({ message: "Answer verified. Proceed to reset password" });
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check password length
    if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Success response
    res.status(200).json({ message: "Password reset successful" });
});

// Export controller functions
module.exports = {
    getSecurityQuestions,
    registerUser,
    loginUser,
    getSecurityQuestion,
    answerSecurityQuestion,
    resetPassword
};