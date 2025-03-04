const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const { User } = require("../models/UserModel");

// Register a new user
const registerUser = asyncHandler(async (request, response) => {
    const { name, email, password } = request.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return response.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send token as response
    response.json({ message: "Login successful", token });
});

// Export controller functions
module.exports = {
    registerUser,
    loginUser
};