const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const { User } = require("../models/UserModel");
const { securityQuestions } = require("../utils/securityQuestions");

// Get security questions
const getSecurityQuestions = async (req, res) => {
    try {
        res.status(200).json({ securityQuestions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Register user
const registerUser = asyncHandler(async (request, response) => {
    console.log("Received data:", request.body);
    const { name, email, password, securityQuestion, securityAnswer, macroTracker } = request.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return response.status(400).json({ message: "User already exists" });
    }

    // Hash password and security answer before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(securityAnswer, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        securityQuestion,
        securityAnswer: hashedAnswer,
        macroTracker: macroTracker || {} // Gets Data from Local Storage 
    });

    await user.save();

    response.status(201).json({ message: "User registered successfully" });
});

// Login an existing user
const loginUser = asyncHandler(async (request, response) => {
    const { email, password } = request.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return response.status(404).json({ message: "User not found" });
    }

    // Compare password with the hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return response.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send token as response
    response.json({ message: "Login successful", token });
});

// Get security question for user
const getSecurityQuestion = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send the security question
        res.status(200).json({ securityQuestion: user.securityQuestion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Answer security question
const answerSecurityQuestion = async (req, res) => {
    try {
        const { email, securityAnswer } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify security answer with the hashed answer in database
        const isAnswerValid = await bcrypt.compare(securityAnswer, user.securityAnswer);
        if (!isAnswerValid) {
            return res.status(400).json({ message: "Incorrect answer" });
        }

        res.status(200).json({ message: "Answer verified, proceed to reset password" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Reset user password
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Export controller functions
module.exports = {
    getSecurityQuestions,
    registerUser,
    loginUser,
    getSecurityQuestion,
    answerSecurityQuestion,
    resetPassword
};