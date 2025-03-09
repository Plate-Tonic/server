const express = require("express");
const asyncHandler = require("express-async-handler");
const { uploadImage } = require("../middlewares/uploadMiddleware");
const { validateToken } = require("../middlewares/authMiddleware");
const { getAllMealPlans, getMealPlan, createMealPlan, updateMealPlan, deleteMealPlan } = require("../controllers/MealPlanController");

const router = express.Router();

// Get all meal items
router.get("/", asyncHandler(getAllMealPlans));

// Get one meal item by ID
router.get("/:mealID", asyncHandler(getMealPlan));

// Apply validateToken middleware to following routes in this file
router.use(validateToken);

// Create a meal item
router.post("/", uploadImage.single('mealImage'), asyncHandler(createMealPlan));

// Update a meal item
router.put("/:mealID", uploadImage.single('mealImage'), asyncHandler(updateMealPlan));

// Delete a meal item
router.delete("/:mealID", asyncHandler(deleteMealPlan));

module.exports = router;