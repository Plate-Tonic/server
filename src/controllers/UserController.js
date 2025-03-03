const asyncHandler = require("express-async-handler");

const { User } = require("../models/UserModel");
const { MealPlan } = require("../models/MealPlanModel");
const { calculateTDEE, calculateProtein, calculateFat, calculateCarbs } = require("../utils/calculator")

// Get user profile
const getUser = asyncHandler(async (req, res) => {
    // Extract user ID from request parameters
    const { userID } = req.params;

    // Fetch user by ID
    const user = await User.findById(userID)
        .populate({ path: "selectedMealPlan", model: "MealPlan" }).exec();

    // Check if user exists
    if (!user) {
        return res.status(404).json({ message: `Meal ID ${userID} not found` });
    }

    // Return user
    res.json(user);
});

// Get all user profiles
const getAllUsers = asyncHandler(async (req, res) => {
    // Fetch users from the database
    const users = await User.find()
        .populate({ path: "selectedMealPlan", model: "MealPlan" }).exec();

    // Check if users exists
    if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    // Return users
    res.json(users);
});

// Update user profile
const updateUser = asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin, macroTracker, selectedMealPlan } = req.body;

    // Extract user ID from the request parameters
    const { userID } = req.params;

    // Confirm required fields are provided
    if (!name || !email || !password || !isAdmin || !macroTracker || !selectedMealPlan) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch user by ID
    const user = await User.findById(userID).exec();

    // Check if user exists
    if (!user) {
        return res.status(404).json({ message: `User ID ${userID} not found` });
    }

    // Check for duplicate user
    const duplicate = await User.findOne({ name }).exec()

    // Update user if no duplicate exists, or it's the same user
    if (duplicate && duplicate?._id.toString() !== userID) {
        return res.status(409).json({ message: "Duplicate user" })
    }

    // Update user with new data
    user.name = name
    user.email = email
    user.password = password
    user.isAdmin = isAdmin
    user.macroTracker = macroTracker
    user.selectedMealPlan = selectedMealPlan

    // Save updated user
    const updatedUser = await user.save()

    // Success message
    res.json({ message: `Updated profile for ${updatedUser.email}` })
});

// Delete user profile
const deleteUser = asyncHandler(async (req, res) => {
    // Extract user ID from request parameters
    const { userID } = req.params

    // Check if meal ID is provided
    if (!userID) {
        return res.status(400).json({ message: "User ID required" });
    }

    // Delete user
    const user = await User.findByIdAndDelete(userID).exec();

    if (!user) {
        return res.status(404).json({ message: `User ID ${userID} not found` });
    }

    // Success message
    res.json({ message: `Deleted ${user.email}` });
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

    // Add dietary preference to user (assuming you have a User model)
    const user = await User.findByIdAndUpdate(req.user._id, { dietaryPreference }, { new: true });

    // Success or error message
    if (user) {
        res.status(200).json({ message: "Dietary preference added" });
    } else {
        res.status(500).json({ message: "Error adding dietary preference" });
    }
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

    // Update user's dietary preference
    const user = await User.findByIdAndUpdate(req.user._id, { dietaryPreference }, { new: true });

    // Success or error message
    if (user) {
        res.status(200).json({ message: "Dietary preference updated successfully" });
    } else {
        res.status(500).json({ message: "Error updating dietary preference" });
    }
});

// Add user's meal plan
const addUserMealPlan = asyncHandler(async (req, res) => {
    const { userID } = req.params;
    const { selectedMealPlan } = req.body;

    // Validate input
    if (!selectedMealPlan) {
        return res.status(400).json({ message: "Meal Plan ID is required" });
    }

    // Check if the user exists
    const user = await User.findById(userID);
    if (!user) {
        return res.status(404).json({ message: `User ID ${userID} not found` });
    }

    // Check if the meal plan exists
    const mealPlan = await MealPlan.findById(selectedMealPlan);
    if (!mealPlan) {
        return res.status(404).json({ message: `Meal Plan ID ${selectedMealPlan} not found` });
    }

    // Add meal plan to user's profile
    if (!user.selectedMealPlan) {
        user.selectedMealPlan = [];
    }
    user.selectedMealPlan.push({
        _id: mealPlan._id,
        dietaryPreference: user.dietaryPreference // Use the dietary preference already added
    });

    // Save updated user
    const updatedUser = await user.save();

    // Success message
    res.status(200).json({
        message: "Meal Plan added successfully",
        updatedUser: { selectedMealPlan: updatedUser.selectedMealPlan }
    });
});

// Update user's meal plan
const updateUserMealPlan = asyncHandler(async (req, res) => {
    const { userID } = req.params;
    const { selectedMealPlan } = req.body;

    // Validate input
    if (!selectedMealPlan) {
        return res.status(400).json({ message: "Meal Plan ID is required" });
    }

    // Check if the user exists
    const user = await User.findById(userID);
    if (!user) {
        return res.status(404).json({ message: `User ID ${userID} not found` });
    }

    // Check if the meal plan exists
    const mealPlan = await MealPlan.findById(selectedMealPlan);
    if (!mealPlan) {
        return res.status(404).json({ message: `Meal Plan ID ${selectedMealPlan} not found` });
    }

    // Update user's meal plan
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

// Add calorie and macro tracker
const addTracker = asyncHandler(async (req, res) => {
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

    // Calculate TDEE and macros
    const calorie = calculateTDEE(age, gender, height, weight, activity, goal);
    const protein = calculateProtein(weight);
    const fat = calculateFat(calorie, protein);
    const carbs = calculateCarbs(calorie, protein, fat);

    // Add macro tracker to user's profile
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

// Update macro tracker
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

    // Update editable fields in user's profile
    const user = await User.findByIdAndUpdate(req.user._id, {
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
    addTracker,
    updateTracker
};