const express = require("express");
const { getUser, selectUserMealPlan, updateUser, updateUserMealPlan } = require("../controllers/UserController");

const router = express.Router();

// Get a user's profile
router.get("/:userID", getUser);

// Update user's profile information
router.put("/:userID", updateUser);

// Select a meal plan for the user
router.post("/meal-plan/:userID", selectUserMealPlan);

// Update user's meal plan
router.put("/meal-plan/:userID", updateUserMealPlan);

module.exports = router;