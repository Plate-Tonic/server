const express = require("express");
const { getUser, selectUserMealPlan, updateUser, updateUserMealPlan, selectUserSubscription, updateUserSubscription, getOrderHistory } = require("../controllers/UserController");

const router = express.Router();

// Get a user's profile
router.get("/profile/:userID", getUser);

// Update user's profile information
router.put("/profile/:userID", updateUser);

// Select a meal plan for the user
router.post("/meal-plan/:userID", selectUserMealPlan);

// Update user's meal plan
router.put("/meal-plan/:userID", updateUserMealPlan);

// Select a subscription plan for the user
router.post("/subscription/:userID", selectUserSubscription);

// Update user's subscription plan
router.put("/subscription/:userID", updateUserSubscription);

// Get user's order history
router.get("/order-history/:userID", getOrderHistory);

module.exports = router;
