const express = require("express");
const asyncHandler = require("express-async-handler");
const { validateToken } = require("../middlewares/authMiddleware");
const { getUser, getAllUsers, updateUser, deleteUser, addDietaryPreference, updateDietaryPreference, addUserMealPlan, deleteUserMealPlan, getTracker, addTrackerNonUser, addTracker, updateTracker } = require("../controllers/UserController");

const router = express.Router();

// Add calorie and macro tracker for non-users (no token required)
router.post("/calorie-tracker", asyncHandler(addTrackerNonUser));

// Apply validateToken middleware to routes that require authentication
router.use(validateToken);

// Get calorie and macro tracker for users (requires token)
router.get("/:userId/calorie-tracker", asyncHandler(getTracker));

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

// Delete user's meal plan
router.delete("/:userId/meal-plan/:mealId", asyncHandler(deleteUserMealPlan));

// Add calorie and macro tracker for users (requires token)
router.post("/:userId/calorie-tracker", asyncHandler(addTracker));

// Update calorie and macro tracker (requires token)
router.put("/:userId/calorie-tracker", asyncHandler(updateTracker));

module.exports = router;
