const express = require("express");
const { getAllMealPlans, getMealPlan, createMealPlan, updateMealPlan, deleteMealPlan } = require("../controllers/MealPlanController");

const router = express.Router();

// Get all meal items
router.get("/", getAllMealPlans);

// Get one meal item by ID
router.get("/:mealID", getMealPlan);

// Create a meal item
router.post("/", createMealPlan);

// Update a meal item
router.put("/:mealID", updateMealPlan);

// Delete a meal item
router.delete("/:mealID", deleteMealPlan);

module.exports = router;