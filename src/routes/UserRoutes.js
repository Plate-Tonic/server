const express = require("express");
const asyncHandler = require("express-async-handler");
const { validateToken } = require("../middlewares/authMiddleware");
const { getUser, getAllUsers, updateUser, deleteUser, addDietaryPreference, updateDietaryPreference, addUserMealPlan, updateUserMealPlan, deleteUserMealPlan, getTracker, addTracker, updateTracker } = require("../controllers/UserController");

const router = express.Router();

// Get calorie and macro tracker
router.get("/:userId/calorie-tracker", asyncHandler(getTracker));

// Apply validateToken middleware to following routes in this file
router.use(validateToken);

// Get all user profiles
router.get("/", asyncHandler(getAllUsers));

// Get a user's profile
router.get("/:userId", asyncHandler(getUser));

// Update user's profile
router.put("/:userId", asyncHandler(updateUser));

// Delete a user profile
router.delete("/:userId", asyncHandler(deleteUser));

// Add a dietary preference for the user
router.post("/:userId/dietary-preference", asyncHandler(addDietaryPreference));

// Update dietary preference for the user
router.put("/:userId/dietary-preference", asyncHandler(updateDietaryPreference));

// Add a meal plan for the user
router.post("/:userId/meal-plan", asyncHandler(addUserMealPlan));

// Update user's meal plan
router.put("/:userId/meal-plan", asyncHandler(updateUserMealPlan));

// Delete user's meal plan
router.delete("/:userId/meal-plan/:mealID", asyncHandler(deleteUserMealPlan));

// Add calorie and macro tracker
router.post("/:userId/calorie-tracker", asyncHandler(addTracker));

// Update calorie and macro tracker
router.put("/:userId/calorie-tracker", asyncHandler(updateTracker));

module.exports = router;