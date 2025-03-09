const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt")
const { User } = require("../models/UserModel");
const { MealPlan } = require("../models/MealPlanModel");
const { calculateCalories, calculateProtein, calculateFat, calculateCarbs } = require("../utils/calculator")

// Get all user profiles (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
    // Check for admin rights
    if (!req.authUserData.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Only admins can view all users" });
    }

    // Fetch users from the database
    const users = await User.find()
        .select("-password")
        .populate({ path: "selectedMealPlan", select: "name" });

    // Check if users exists
    if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    // Success message
    res.json({ message: "Users retrieved successfully", data: users });
});

// Get user profile
const getUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Fetch user by ID
    const user = await User.findById(userId)
        .populate({ path: "selectedMealPlan" });

    if (!user) {
        return res.status(404).json({ message: `User ID ${userId} not found` });
    }

    // Success response
    res.json({ message: "User retrieved successfully", data: user });
});

// Update user profile
const updateUser = asyncHandler(async (req, res) => {
    const { name, email, password, newPassword, isAdmin } = req.body;
    const { userId } = req.params;

    // Check if user is trying to update their own tracker
    if (req.authUserData.userId !== userId) {
        return res.status(403).json({ message: "Forbidden: You can only update your own profile" });
    }

    // Fetch user by ID
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: `User ID ${userId} not found` });
    }

    // Update name
    if (name) {
        user.name = name;
        await user.save();
        return res.status(200).json({ success: true, message: "Name updated successfully" });
    };

    // Update email
    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
            return res.status(409).json({ message: `User with email ${email} already exists` });
        }
        user.email = email;

        await user.save();
        res.json({ message: "Email updated successfully" });
    }

    // Update password
    if (password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        // Hash the new password and save
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({ success: true, message: "Password updated successfully" });
    }

    // Update admin rights (admin only)
    if (req.authUserData.isAdmin && isAdmin) {
        user.isAdmin = isAdmin;
        await user.save();

        return res.status(200).json({ success: true, message: "Admin rights updated successfully" });
    }
});

// Delete user profile (admin only)
const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params

    // Check for admin rights
    if (!req.authUserData.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Only admins can delete users" });
    }

    // Delete user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        return res.status(404).json({ message: `User ID ${userId} not found` });
    }

    // Success message
    res.json({ message: `User ${user.email} deleted successfully` });
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
    const user = await User.findByIdAndUpdate(
        req.authUserData.userId,
        { dietaryPreference },
        { new: true }
    );

    // Success message
    res.json({ message: "Dietary preference added successfully", data: user });
});

// Update user's dietary preference
const updateDietaryPreference = asyncHandler(async (req, res) => {
    const { dietaryPreference } = req.body;
    const { userId } = req.params;

    // Check if user is trying to update their own preference
    if (req.authUserData.userId !== userId) {
        return res.status(403).json({ message: "Forbidden: You can only update your own preference" });
    }

    // Validate input
    if (!dietaryPreference) {
        return res.status(400).json({ message: "Dietary preference is required" });
    }

    // Validate dietary preference
    const validPreferences = ["vegetarian", "vegan", "gluten-free", "nut-free", "none"];
    if (!validPreferences.includes(dietaryPreference)) {
        return res.status(400).json({ message: "Invalid dietary preference" });
    }

    // Update user's dietary preference
    const user = await User.findByIdAndUpdate(
        userId,
        { dietaryPreference },
        { new: true }
    );

    // Success message
    res.json({ message: "Dietary preference updated successfully", data: user });
});

// Add user's meal item
const addUserMealPlan = asyncHandler(async (req, res) => {
    const { selectedMealPlan } = req.body;
    const { userId } = req.params;

    // Fetch user by ID
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: `User ID ${userId} not found` });
    }

    // Check if meal item is already in user's meal plan
    const mealExists = user.selectedMealPlan.some(meal => meal._id.toString() === selectedMealPlan);

    if (mealExists) {
        return res.status(400).json({ message: "Meal is already in your meal plan" });
    }

    // Add meal to user's selectedMealPlan
    user.selectedMealPlan.push(selectedMealPlan);
    await user.save();

    // Success message
    res.json({ message: "Meal item added successfully", data: user });
});

// Delete user's meal item
const deleteUserMealPlan = asyncHandler(async (req, res) => {
    const { mealId, userId } = req.params;

    // Fetch user by ID
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: `User ID ${userId} not found` });
    }

    // Check if the meal item exists in the user's meal plan
    const mealIndex = user.selectedMealPlan.findIndex(meal => meal._id.toString() === mealId);
    if (mealIndex === -1) {
        return res.status(404).json({ message: `Meal ID ${mealId} not found in user's meal plan` });
    }

    // Remove the meal item from the user's meal plan
    user.selectedMealPlan.splice(mealIndex, 1);
    await user.save();

    // Success message
    res.json({ message: "Meal item deleted successfully", data: user });
});

// Get calorie and macro tracker
const getTracker = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate the ObjectId of the user
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
    }

    // Fetch user by ID
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: `User ID ${userId} not found` });
    }

    // Check if macro tracker exists
    if (!user.macroTracker) {
        return res.status(404).json({ message: "Tracker data not found" });
    }

    // Success message
    res.json({ message: "Tracker data retrieved successfully", data: user.macroTracker });
});

// Add calorie and macro tracker for non-users
const addTrackerNonUser = asyncHandler(async (req, res) => {
    const { age, weight, height, gender, activity, goal } = req.body;

    // Check if required fields are provided
    if (!age || !weight || !height || !gender || !activity || !goal) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate activity and goal
    const validActivities = [
        "Sedentary (little or no exercise)",
        "Lightly active (light exercise 1-3 days/week)",
        "Moderately active (moderate exercise 3-5 days/week)",
        "Very active (hard exercise 6-7 days/week)",
        "Super active (very intense exercise, physical job, etc.)"
    ];
    const validGoals = [
        "Lose Weight",
        "Maintain Weight",
        "Gain Muscle"
    ];
    if (!validActivities.includes(activity) || !validGoals.includes(goal)) {
        return res.status(400).json({ message: "Invalid activity or goal" });
    }

    // Calculate macro data
    const calories = calculateCalories(age, weight, height, gender, activity, goal);
    const protein = calculateProtein(calories);
    const fat = calculateFat(calories);
    const carbs = calculateCarbs(calories);

    // Success message
    res.json({ message: "Macro data calculated successfully", data: { calories, protein, fat, carbs } });
});

// Add calorie and macro tracker for users
const addTracker = asyncHandler(async (req, res) => {
    const { age, weight, height, gender, activity, goal } = req.body;
    const { userId } = req.params;

    // Check if required fields are provided
    if (!age || !weight || !height || !gender || !activity || !goal) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate activity and goal
    const validActivities = [
        "Sedentary (little or no exercise)",
        "Lightly active (light exercise 1-3 days/week)",
        "Moderately active (moderate exercise 3-5 days/week)",
        "Very active (hard exercise 6-7 days/week)",
        "Super active (very intense exercise, physical job, etc.)"
    ];
    const validGoals = [
        "Lose Weight",
        "Maintain Weight",
        "Gain Muscle"
    ];
    if (!validActivities.includes(activity) || !validGoals.includes(goal)) {
        return res.status(400).json({ message: "Invalid activity or goal" });
    }

    // Validate the ObjectId of the user
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
    }

    // Fetch user by ID
    const user = await User.findById(userId).exec();

    if (!user) {
        return res.status(404).json({ message: `User ID ${userId} not found` });
    }

    // Calculate macro data
    const calories = calculateCalories(age, weight, height, gender, activity, goal);
    const protein = calculateProtein(calories);
    const fat = calculateFat(calories);
    const carbs = calculateCarbs(calories);

    // Add macro tracker to user
    user.macroTracker = {
        age,
        weight,
        height,
        gender,
        activity,
        goal,
        calories,
        protein,
        fat,
        carbs
    };
    await user.save();

    // Success message
    res.json({ message: "Macro tracker added successfully", data: user.macroTracker });
});

// Update calorie and macro tracker
const updateTracker = asyncHandler(async (req, res) => {
    const { age, weight, height, gender, activity, goal } = req.body;
    const { userId } = req.params;

    // Check if user is trying to update their own tracker
    if (req.authUserData.userId !== userId) {
        return res.status(403).json({ message: "Forbidden: You can only update your own tracker" });
    }

    // Check if required fields are provided
    if (!age || !weight || !height || !gender || !activity || !goal) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Fetch user by ID
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: `User ID ${userId} not found` });
    }

    // Validate activity and goal
    const validActivities = [
        "Sedentary (little or no exercise)",
        "Lightly active (light exercise 1-3 days/week)",
        "Moderately active (moderate exercise 3-5 days/week)",
        "Very active (hard exercise 6-7 days/week)",
        "Super active (very intense exercise, physical job, etc.)"
    ];
    const validGoals = [
        "Lose Weight",
        "Maintain Weight",
        "Gain Muscle"
    ];
    if (!validActivities.includes(activity) || !validGoals.includes(goal)) {
        return res.status(400).json({ message: "Invalid activity or goal" });
    }

    // Recalculate macro data
    const calories = calculateCalories(age, weight, height, gender, activity, goal);
    const protein = calculateProtein(calories);
    const fat = calculateFat(calories);
    const carbs = calculateCarbs(calories);

    // Update macro tracker
    user.macroTracker = {
        age,
        weight,
        height,
        gender,
        activity,
        goal,
        calories,
        protein,
        fat,
        carbs
    };
    await user.save();

    // Success message
    res.json({ message: "Macro tracker updated successfully", data: user.macroTracker });
});

// Export controller functions
module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    addDietaryPreference,
    updateDietaryPreference,
    addUserMealPlan,
    deleteUserMealPlan,
    getTracker,
    addTrackerNonUser,
    addTracker,
    updateTracker
};