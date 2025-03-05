const express = require("express");
const asyncHandler = require("express-async-handler");
const { validateToken } = require("../middlewares/authMiddleware");
const { getUser, getAllUsers, updateUser, deleteUser, addDietaryPreference, updateDietaryPreference, addUserMealPlan, updateUserMealPlan, addTracker, updateTracker } = require("../controllers/UserController");

const router = express.Router();

// Apply validateToken middleware to following routes in this file
router.use(validateToken);

// Get all user profiles
router.get("/", asyncHandler(getAllUsers));

// Get a user's profile
router.get("/:userID", asyncHandler(getUser));

// Update user's profile
router.put("/:userID", asyncHandler(updateUser));

// Delete a user profile
router.delete("/:userID", asyncHandler(deleteUser));

// Add a dietary preference for the user
router.post("/:userID/dietary-preference", asyncHandler(addDietaryPreference));

// Update dietary preference for the user
router.put("/:userID/dietary-preference", asyncHandler(updateDietaryPreference));

// Add a meal plan for the user
router.post("/:userID/meal-plan", asyncHandler(addUserMealPlan));

// Update user's meal plan
router.put("/:userID/meal-plan", asyncHandler(updateUserMealPlan));

// Add calorie and macro tracker
router.post("/:userID/calorie-tracker", asyncHandler(addTracker));

// Update calorie and macro tracker
router.put("/:userID/calorie-tracker", asyncHandler(updateTracker));

module.exports = router;