const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.use(express.json());

app.use(helmet());

let corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "https://reactapp.com"],
    methods: ["GET", "POST", "PUT", "DELETE"]
};
app.use(cors(corsOptions));

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