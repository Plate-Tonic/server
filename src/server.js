const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path"); // Move this line here

const app = express();
app.use(express.json());

app.use(helmet());

// General CORS configuration for all other routes
let corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "https://platetonic.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]  // Allow specific headers

};
app.use(cors(corsOptions));

// Serve static files from /uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (request, response) => {
    response.json({
        message: "Test!"
    });
});

const authRoutes = require("./routes/AuthRoutes.js");
app.use("/", authRoutes);

const userRoutes = require("./routes/UserRoutes.js");
app.use("/user", userRoutes);

const blogPostRoutes = require("./routes/BlogPostRoutes.js");
app.use("/blog", blogPostRoutes);

const mealPlanRoutes = require("./routes/MealPlanRoutes.js");
app.use("/meal-plan", mealPlanRoutes);

module.exports = { app };
