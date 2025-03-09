const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

// Configure express
const app = express();

// Configure CORS
let corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "https://platetonic.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]

};

// Set up middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());

// Test route
app.get("/", (request, response) => {
    response.json({ message: "Test!" });
});

// Serve static files from /uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Auth routes
const authRoutes = require("./routes/AuthRoutes.js");
app.use("/", authRoutes);

// User routes
const userRoutes = require("./routes/UserRoutes.js");
app.use("/user", userRoutes);

// Blog post routes
const blogPostRoutes = require("./routes/BlogPostRoutes.js");
app.use("/blog", blogPostRoutes);

// Meal plan routes
const mealPlanRoutes = require("./routes/MealPlanRoutes.js");
app.use("/meal-plan", mealPlanRoutes);

module.exports = {
    app
};