const express = require("express");
const asyncHandler = require("express-async-handler");

const { getUser, getAllUsers, updateUser, deleteUser, addDietaryPreference, updateDietaryPreference, addUserMealPlan, updateUserMealPlan, addTracker, updateTracker } = require("../controllers/UserController");

const router = express.Router();

// Get a user's profile
router.get("/:userID", asyncHandler(getUser));

// Get all user profiles
router.get("/", asyncHandler(getAllUsers));

// Update user's profile
router.put("/:userID", asyncHandler(updateUser));

// Delete a user profile
router.delete("/:userID", asyncHandler(deleteUser));

// Add a dietary preference for the user
router.post("/:userID/dietary-preference", asyncHandler(addDietaryPreference));

// Update dietary preference for the user
router.post("/:userID/dietary-preference", asyncHandler(updateDietaryPreference));

// Add a meal plan for the user
router.post("/:userID/meal-plan", asyncHandler(addUserMealPlan));

// Update user's meal plan
router.put("/:userID/meal-plan", asyncHandler(updateUserMealPlan));

module.exports = router;