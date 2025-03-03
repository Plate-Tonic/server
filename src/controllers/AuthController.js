const { User } = require("../models/UserModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
async function registerUser(request, response) {
    try {
        const { email, password, name } = request.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({ message: "User already exists" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            password: hashedPassword,
            name
        });

        await user.save();

        response.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error creating user: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Login an existing user
async function loginUser(request, response) {
    try {
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
    } catch (error) {
        console.error("Error logging in: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Export controller functions
module.exports = {
    registerUser,
    loginUser
};