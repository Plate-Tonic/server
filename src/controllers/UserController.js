const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt")

const { User } = require("../models/UserModel");
const { MealPlan } = require("../models/MealPlanModel");
const { calculateTDEE, calculateProtein, calculateFat, calculateCarbs } = require("../utils/calculator")

// Get user profile
const getUser = asyncHandler(async (req, res) => {
    // Extract user ID from request parameters
    const { userId } = req.params;

    // Fetch user by ID
    const user = await User.findById(userId)
        .populate({ path: "selectedMealPlan" })

    // Check if user exists
    if (!user) {
        return res.status(404).json({ message: `User ID ${userId} not found` });
    }

    // Return user
    res.json(user);
});

// Get all user profiles
const getAllUsers = asyncHandler(async (req, res) => {
    // Fetch users from the database
    const users = await User.find()
        .select("-password")
        .populate({ path: "selectedMealPlan", select: "name" });

    // Check if users exists
    if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    // Return users
    res.json(users);
});

// Update user profile
const updateUser = asyncHandler(async (req, res) => {
    // Extract user data from request body
    const { name, email, password, isAdmin } = req.body;

    // Check at least one field is provided
    if (!name && !email && !password && isAdmin === undefined) {
        return res.status(400).json({ message: "No updates made" });
    }

    // Check if email is unique
    if (email && email !== req.user.email) {
        const duplicate = await User.findOne({ email })
        if (duplicate && duplicate._id.toString() !== req.user._id) {
            return res.status(409).json({ message: `User with ${email} already exists` });
        }
    }

    // Check if user is an admin when editing admin rights
    if (isAdmin && !req.authUserData.isAdmin) {
        return res.status(403).json({ message: "Forbidden access" });
    }
    // Update user with new data
    if (name) req.user.name = name;
    if (email) req.user.email = email;
    if (password) {
        req.user.password = await bcrypt.hash(password, 10);
    }
    if (req.authUserData.isAdmin) {
        req.user.isAdmin = isAdmin;
    }

    // Save updated user
    const updatedUser = await req.user.save();

    // Success message
    res.json({ message: `Updated profile for ${updatedUser.email}` })
});

// Delete user profile (admin only)
const deleteUser = asyncHandler(async (req, res) => {
    // Extract user ID from request parameters
    const { userId } = req.params

    // Check for admin rights
    if (!req.authUserData.isAdmin) {
        return res.status(403).json({ message: "Forbidden access" });
    }

    // Delete user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        return res.status(404).json({ message: `User ID ${userId} not found` });
    }

    // Success message
    res.json({ message: `Deleted user ${user.email}` });
});

// Add user's dietary preference
const addDietaryPreference = asyncHandler(async (req, res) => {
    const { dietaryPreference } = req.body;

    // Confirm required fields are provided
    if (!dietaryPreference) {
        return res.status(400).json({ message: "Dietary preference is required" });
    }

    // Validate dietary preference
    const validPreferences = ["vegetarian", "vegan", "gluten-free", "nut-free", "none"];
    if (!validPreferences.includes(dietaryPreference)) {
        return res.status(400).json({ message: "Invalid dietary preference" });
    }

    // Add user's dietary preference
    const user = await User.findByIdAndUpdate(req.user._id, { dietaryPreference }, { new: true });

    // Success message
    res.status(200).json({ message: "Dietary preference added" });
});

// Update user's dietary preference
const updateDietaryPreference = asyncHandler(async (req, res) => {
    const { dietaryPreference } = req.body;

    // Validate input
    if (!dietaryPreference) {
        return res.status(400).json({ message: "Dietary preference is required" });
    }

    // Validate dietary preference
    const validPreferences = ["vegetarian", "vegan", "gluten-free", "nut-free", "none"];
    if (!validPreferences.includes(dietaryPreference)) {
        return res.status(400).json({ message: "Invalid dietary preference" });
    }

    // Check if user is an admin or trying to edit their own preference
    if (req.params.userId.toString() !== req.user._id.toString() && !req.authUserData.isAdmin) {
        return res.status(403).json({ message: "Forbidden access" });
    }

    // Update user's dietary preference
    const user = await User.findByIdAndUpdate(req.params.userId, { dietaryPreference }, { new: true });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Success message
    res.status(200).json({ message: "Dietary preference updated successfully" });
});

// Add user's meal item
const addUserMealPlan = asyncHandler(async (req, res) => {
    const { selectedMealPlan } = req.body;

    // Validate input
    if (!selectedMealPlan) {
        return res.status(400).json({ message: "Meal Plan ID is required" });
    }

    // Check if the meal item exists
    const mealPlan = await MealPlan.findById(selectedMealPlan);
    if (!mealPlan) {
        return res.status(404).json({ message: `Meal Plan ID ${selectedMealPlan} not found` });
    }

    // Update user's meal item
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            selectedMealPlan: {
                _id: mealPlan._id,
                dietaryPreference: req.user.dietaryPreference
            }
        }
    }, { new: true });

    const updatedUser = await user.save();

    // Success message
    res.status(200).json({
        message: "Meal Plan added successfully",
        updatedUser: { selectedMealPlan: updatedUser.selectedMealPlan }
    });
});

// Update user's meal item
const updateUserMealPlan = asyncHandler(async (req, res) => {
    const { selectedMealPlan } = req.body;

    // Validate input
    if (!selectedMealPlan) {
        return res.status(400).json({ message: "Meal Plan ID is required" });
    }

    // Check if user is an admin or trying to update their own meal item
    if (req.params.userId.toString() !== req.user._id.toString() && !req.authUserData.isAdmin) {
        return res.status(403).json({ message: "Forbidden access" });
    }

    // Check if the meal item exists
    const mealPlan = await MealPlan.findById(selectedMealPlan);
    if (!mealPlan) {
        return res.status(404).json({ message: `Meal Plan ID ${selectedMealPlan} not found` });
    }

    // Update user's meal item
    const user = await User.findById(req.user._id);
    if (!user.selectedMealPlan) {
        user.selectedMealPlan = [];
    }
    const index = user.selectedMealPlan.findIndex(plan => plan._id.toString() === selectedMealPlan);
    if (index !== -1) {
        user.selectedMealPlan[index] = {
            _id: mealPlan._id,
            dietaryPreference: user.dietaryPreference
        };
    } else {
        user.selectedMealPlan.push({
            _id: mealPlan._id,
            dietaryPreference: user.dietaryPreference
        });
    }

    // Save updated user
    const updatedUser = await user.save();

    // Success message
    res.status(200).json({
        message: "Meal Plan updated successfully",
        updatedUser: { selectedMealPlan: updatedUser.selectedMealPlan }
    });
});

// Delete user's meal item
const deleteUserMealPlan = asyncHandler(async (req, res) => {
    const { mealID, userId } = req.params;

    // Check if user ID and meal ID are present
    if (!userId || !mealID) {
        return res.status(400).json({ message: "User ID or Meal ID is missing." });
    }

    // Check if the user is trying to delete their own meal item or if they are an admin
    if (userId !== req.user.userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden access" });
    }

    // Check if the meal item exists
    const mealPlan = await MealPlan.findById(mealID);
    if (!mealPlan) {
        return res.status(404).json({ message: `Meal Plan ID ${mealID} not found` });
    }

    // Check if the user has the meal item
    const user = await User.findById(userId);
    const mealIndex = user.selectedMealPlan.findIndex(plan => plan.toString() === mealID);
    if (mealIndex === -1) {
        return res.status(404).json({ message: `Meal Plan ID ${mealID} not found in user's meal item` });
    }

    // Remove the meal item
    user.selectedMealPlan.splice(mealIndex, 1);

    // Save the updated user document
    await user.save();

    // Success message
    res.status(200).json({
        message: `Meal Plan ID ${mealID} deleted successfully from user ID ${userId}`
    });
});

// Add calorie and macro tracker
const addTracker = asyncHandler(async (req, res) => {
    const { age, gender, height, weight, activity, goal } = req.body;

    // Validate input
    if (!age || !gender || !height || !weight || !activity || !goal) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate activity and goal
    const activities = ["sedentary", "lightly active", "moderately active", "very active", "extra active"];
    const goals = ["lose weight", "maintain weight", "gain weight"];
    if (!activities.includes(activity) || !goals.includes(goal)) {
        return res.status(400).json({ message: "Invalid activity or goal" });
    }

    // Calculate TDEE and macros
    const calorie = calculateTDEE(age, gender, height, weight, activity, goal);
    const protein = calculateProtein(weight);
    const fat = calculateFat(calorie, protein);
    const carbs = calculateCarbs(calorie, protein, fat);

    // Add tracker to user's profile
    const user = await User.findByIdAndUpdate(req.user._id, {
        macroTracker: {
            age,
            gender,
            height,
            weight,
            activity,
            goal,
            calorie,
            protein,
            fat,
            carbs
        }
    }, { new: true });

    // Success message
    res.status(200).json({
        message: "Macro tracker added successfully",
        user: user.macroTracker
    });
});

// Update calorie and macro tracker
const updateTracker = asyncHandler(async (req, res) => {
    const { age, gender, height, weight, activity, goal } = req.body;

    // Validate input
    if (!age || !gender || !height || !weight || !activity || !goal) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate activity and goal
    const validActivities = ["sedentary", "lightly active", "moderately active", "very active", "extra active"];
    const validGoals = ["lose weight", "maintain weight", "gain weight"];
    if (!validActivities.includes(activity) || !validGoals.includes(goal)) {
        return res.status(400).json({ message: "Invalid activity or goal" });
    }

    // Check if user is an admin or trying to update their own tracker
    if (req.user._id.toString() !== req.params.userId && !req.authUserData.isAdmin) {
        return res.status(403).json({ message: "Forbidden access" });
    }

    // Update editable fields in user's profile
    const user = await User.findByIdAndUpdate(req.params.userId, {
        $set: {
            "macroTracker.age": age,
            "macroTracker.gender": gender,
            "macroTracker.height": height,
            "macroTracker.weight": weight,
            "macroTracker.activity": activity,
            "macroTracker.goal": goal
        }
    }, { new: true });

    // Recalculate calorie and macro intake
    const calorie = calculator.calculateTDEE(user.macroTracker.age, user.macroTracker.gender, user.macroTracker.height, user.macroTracker.weight, user.macroTracker.activity, user.macroTracker.goal);
    const protein = calculator.calculateProtein(user.macroTracker.weight);
    const fat = calculator.calculateFat(calorie, protein);
    const carbs = calculator.calculateCarbs(calorie, protein, fat);

    // Update remaining fields in user's profile
    user.macroTracker.calorie = calorie;
    user.macroTracker.protein = protein;
    user.macroTracker.fat = fat;
    user.macroTracker.carbs = carbs;

    await user.save();

    // Success message
    res.status(200).json({
        message: "Macro tracker updated successfully",
        user: user.macroTracker
    });
});

// Export controller functions
module.exports = {
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    addDietaryPreference,
    updateDietaryPreference,
    addUserMealPlan,
    updateUserMealPlan,
    deleteUserMealPlan,
    addTracker,
    updateTracker
};