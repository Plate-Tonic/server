const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt")

const { User } = require("../models/UserModel");
const { MealPlan } = require("../models/MealPlanModel");
const { calculateCalories, calculateProtein, calculateFat, calculateCarbs } = require("../utils/calculator")

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
    const { name, email, password, newPassword, isAdmin } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);

    // Check if user is trying to update their own tracker
    if (req.authUserData && req.authUserData._id.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Forbidden access" });
    }

    // No updates provided
    if (!name && !email && !password && !newPassword && isAdmin === undefined) {
        return res.status(400).json({ message: "No updates made" });
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
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
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
    try {
        const { selectedMealPlan } = req.body;
        const userId = req.params.userId;

        console.log('Request body:', req.body);
        console.log('User ID:', userId);

        const user = await User.findById(userId);
        console.log('User document before update:', user);

        // Check if the meal item is already in the user's meal plan
        const mealExists = user.selectedMealPlan.some(meal => meal._id.toString() === selectedMealPlan);
        if (mealExists) {
            console.log("Meal item is already in the user's meal plan");
            return res.status(400).json({ message: 'Meal is already in your meal plan.' });
        }

        // Update the selectedMealPlan field
        user.selectedMealPlan.push({ _id: selectedMealPlan });
        await user.save();

        console.log('User document after update:', user);

        res.status(200).json({ message: 'Meal item added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding meal item to user\'s meal plan' });
    }
});

// Update user's meal item
const updateUserMealPlan = asyncHandler(async (req, res) => {
    const { selectedMealPlan } = req.body;
    const { userId } = req.params;

    // Validate input
    if (!selectedMealPlan) {
        return res.status(400).json({ message: "Meal Plan ID is required" });
    }

    // Ensure only users can update their own meal items
    if (userId !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden access" });
    }

    // Check if the meal plan exists
    const mealPlan = await MealPlan.findById(selectedMealPlan);
    if (!mealPlan) {
        return res.status(404).json({ message: `Meal Plan ID ${selectedMealPlan} not found` });
    }

    // Update user's meal plan
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
    const { mealId, userId } = req.params;

    // Check if user ID and meal ID are present
    if (!userId || !mealId) {
        return res.status(400).json({ message: "User ID or Meal ID is missing." });
    }

    // Check if user is trying to update their own tracker
    if (req.authUserData && req.authUserData._id.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Forbidden access" });
    }

    // Check if the user has the meal item
    const user = await User.findById(userId);
    const mealIndex = user.selectedMealPlan.findIndex(plan => plan.toString() === mealId);
    if (mealIndex === -1) {
        return res.status(404).json({ message: `Meal ID ${mealId} not found in user's meal item` });
    }

    // Remove the meal from user's selectedMealPlan array
    user.selectedMealPlan = user.selectedMealPlan.filter(meal => meal._id.toString() !== mealId);
    await user.save(); // Save updated user data

    // Success message
    res.status(200).json({
        message: `Meal ID ${mealId} deleted successfully from user ID ${userId}`
    });
});

// Get calorie and macro tracker
const getTracker = asyncHandler(async (req, res) => {
    // Extract user ID from request parameters
    const { userId } = req.params;

    // Fetch user by ID
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (!user.macroTracker) {
        return res.status(404).json({ message: "Tracker data not found" });
    }

    res.json(user.macroTracker);
});

// Add calorie and macro tracker for non-users
const addTrackerNonUser = asyncHandler(async (req, res) => {
    const { age, weight, height, gender, activity, goal } = req.body;

    // Confirm required fields are provided
    if (!age || !weight || !height || !gender || !activity || !goal) {
        return res.status(400).json({ message: "Missing required fields" });
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

    const calories = calculateCalories(age, weight, height, gender, activity, goal);
    const protein = calculateProtein(calories);
    const fat = calculateFat(calories);
    const carbs = calculateCarbs(calories);

    // Send back the calculated results
    res.json({
        calories,
        protein,
        fat,
        carbs,
    });
});

// Add calorie and macro tracker
const addTracker = asyncHandler(async (req, res) => {
    const { age, weight, height, gender, activity, goal } = req.body;

    // Extract user ID from the request parameters
    const { userId } = req.params;

    // Confirm required fields are provided
    if (!age || !weight || !height || !gender || !activity || !goal) {
        return res.status(400).json({ message: "Missing required fields" });
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

    // Fetch user by userId
    const user = await User.findById(userId).exec();

    // Check if user exists
    if (!user) {
        return res.status(404).json({ message: `User ID ${userId} not found` });
    }

    // Calculate TDEE and macros
    const calories = calculateCalories(age, weight, height, gender, activity, goal);
    const protein = calculateProtein(calories);
    const fat = calculateFat(calories);
    const carbs = calculateCarbs(calories);

    // Add tracker to user's profile
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

    // Save updated user with macro tracker
    await user.save();

    // Success message
    res.status(200).json({
        message: "Macro tracker added successfully",
        user: user.macroTracker
    });
    console.log(req.body);
});

// Update calorie and macro tracker
const updateTracker = asyncHandler(async (req, res) => {
    const { age, weight, height, gender, activity, goal } = req.body;

    // Confirm required fields are provided
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

    // Check if user is trying to update their own tracker
    if (req.authUserData && req.authUserData._id.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Forbidden access" });
    }

    // Fetch user by user ID
    const user = await User.findById(req.params.userId).exec();

    // Check if user exists
    if (!user) {
        return res.status(404).json({ message: `User ID ${req.params.userId} not found` });
    }

    // Update editable fields in user's macroTracker
    user.macroTracker.age = age;
    user.macroTracker.gender = gender;
    user.macroTracker.height = height;
    user.macroTracker.weight = weight;
    user.macroTracker.activity = activity;
    user.macroTracker.goal = goal;

    // Recalculate calorie and macro intake
    const calories = calculateCalories(age, weight, height, gender, activity, goal);
    const protein = calculateProtein(calories);
    const fat = calculateFat(calories);
    const carbs = calculateCarbs(calories);

    // Update remaining fields in user's profile
    user.macroTracker.calories = calories;
    user.macroTracker.protein = protein;
    user.macroTracker.fat = fat;
    user.macroTracker.carbs = carbs;

    // Save the updated user document
    await user.save();

    // Success message
    res.status(200).json({
        message: "Macro tracker updated successfully",
        user: user.macroTracker
    });
    console.log(req.body);
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
    getTracker,
    addTrackerNonUser,
    addTracker,
    updateTracker
};