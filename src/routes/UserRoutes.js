const express = require("express");
const { registerUser, loginUser, getUser, selectMealPlan, updateUser, updateMealPlan, selectSubscription, updateSubscription, getOrderHistory } = require("../controllers/UserController");

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login an existing user
router.post("/login", loginUser);

// Get a user's profile
router.get("/profile/:userID", getUser);

// Update user's profile information
router.put("/profile/:userID", updateUser);

// Select a meal plan for the user
router.post("/meal-plan/:userID", selectMealPlan);

// Update user's meal plan
router.put("/meal-plan/:userID", updateMealPlan);

// Select a subscription plan for the user
router.post("/subscription/:userID", selectSubscription);

// Update user's subscription plan
router.put("/subscription/:userID", updateSubscription);

// Get user's order history
router.get("/order-history/:userID", getOrderHistory);

module.exports = router;
