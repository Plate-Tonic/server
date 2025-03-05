const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const { User } = require("../models/UserModel");
const { MealPlan } = require("../models/MealPlanModel");
const { calculateTDEE, calculateProtein, calculateFat, calculateCarbs } = require("../utils/calculator");

// Get user profile
const getUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Fetch user with populated meal plan
    const user = await User.findById(userId)
        .populate("selectedMealPlan");

    if (!user) {
        return res.status(404).json({ message: `User ID ${userId} not found` });
    }

    res.json(user);
});

// Get all user profiles
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find()
        .select("-password")
        .populate("selectedMealPlan", "name");

    if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
});

// Add meal to user's selected meals
const addUserMealPlan = asyncHandler(async (req, res) => {
    const { selectedMealPlan } = req.body;
    const { userId } = req.params;

    if (!selectedMealPlan) {
        return res.status(400).json({ message: "Meal Plan ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const meal = await MealPlan.findById(selectedMealPlan);
    if (!meal) {
        return res.status(404).json({ message: `Meal Plan ID ${selectedMealPlan} not found` });
    }

    // Ensure selectedMealPlan exists and avoid duplicates
    if (!user.selectedMealPlan.includes(selectedMealPlan)) {
        user.selectedMealPlan.push(selectedMealPlan);
    }

    await user.save();

    res.status(200).json({
        message: "Meal added successfully",
        selectedMealPlan: user.selectedMealPlan,
    });
});

// Remove meal from user's selected meals
const deleteUserMealPlan = asyncHandler(async (req, res) => {
    const { mealID, userId } = req.params;

    if (!userId || !mealID) {
        return res.status(400).json({ message: "User ID or Meal ID is missing." });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Remove the meal from selectedMealPlan
    user.selectedMealPlan = user.selectedMealPlan.filter(id => id.toString() !== mealID);

    await user.save();

    res.status(200).json({
        message: `Meal Plan ID ${mealID} removed successfully from user ID ${userId}`,
        selectedMealPlan: user.selectedMealPlan,
    });
});

// Add/update macro tracker
const addTracker = asyncHandler(async (req, res) => {
    const { age, gender, height, weight, activity, goal } = req.body;
    const { userId } = req.params;

    if (!age || !gender || !height || !weight || !activity || !goal) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const calorie = calculateTDEE(age, gender, height, weight, activity, goal);
    const protein = calculateProtein(weight);
    const fat = calculateFat(calorie, protein);
    const carbs = calculateCarbs(calorie, protein, fat);

    user.macroTracker = {
        age, gender, height, weight, activity, goal,
        calorie, protein, fat, carbs
    };

    await user.save();

    res.status(200).json({
        message: "Macro tracker updated successfully",
        macroTracker: user.macroTracker
    });
});

// Export controller functions
module.exports = {
    getUser,
    getAllUsers,
    addUserMealPlan,
    deleteUserMealPlan,
    addTracker
};
