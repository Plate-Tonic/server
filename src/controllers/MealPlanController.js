const asyncHandler = require("express-async-handler");
const { MealPlan } = require("../models/MealPlanModel");

// Get all meal items
const getAllMealPlans = asyncHandler(async (req, res) => {
    // Fetch meal items from the database
    const mealItems = await MealPlan.find();

    // Check if meal items exists
    if (!mealItems || mealItems.length === 0) {
        return res.status(404).json({ message: "No meal items found" });
    }

    // Success message
    res.json({ message: "Meal items retrieved successfully", data: mealItems });
});

// Get meal item
const getMealPlan = asyncHandler(async (req, res) => {
    const { mealId } = req.params;

    // Fetch meal item by ID
    const mealItem = await MealPlan.findById(mealId);

    if (!mealItem) {
        return res.status(404).json({ message: `Meal ID ${mealId} not found` });
    }

    // Success message
    res.json({ message: "Meal item retrieved successfully", data: mealItem });
});

// Create meal item
const createMealPlan = asyncHandler(async (req, res) => {
    let { name, description, ingredients, preference, calories, protein, fat, carbs } = req.body;

    // Admin check
    if (!req.authUserData?.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Only admins can create meal items" });
    }

    // Check if required fields are provided
    if (!name || !description || !ingredients || !preference || !calories || !protein || !fat || !carbs) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.file) {
        return res.status(400).json({ message: "Meal image is required" });
    }

    // Get the path of the uploaded file
    const mealImage = `/uploads/${req.file.filename}`;

    // Check if preference is an array
    if (!Array.isArray(preference)) {
        preference = preference.split(",").map((item) => item.trim());
    }

    // Check for duplicate meal item
    const duplicate = await MealPlan.findOne({ name }).exec();

    if (duplicate) {
        return res.status(409).json({ message: `Meal item ${name} already exists` });
    }

    // Create and store new meal item
    const mealItem = await MealPlan.create({
        name,
        description,
        ingredients: ingredients.split(",").map((item) => item.trim()), 
        preference,
        calories,
        protein,
        fat,
        carbs,
        mealImage
    });

    // Success message
    res.status(201).json({ message: "New meal item created", data: mealItem });
});

// Update meal item
const updateMealPlan = asyncHandler(async (req, res) => {
    const { name, description, ingredients, preference, calories, protein, fat, carbs } = req.body;
    const { mealId } = req.params;

    // Admin check
    if (!req.authUserData?.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Only admins can update meal items" });
    }

    // Check if file was uploaded
    const mealImage = req.file ? req.file.filename : undefined;

    // Check for duplicate meal item
    const duplicate = await MealPlan.findOne({ name }).exec()

    if (duplicate && duplicate?._id.toString() !== mealId) {
        return res.status(409).json({ message: `Meal item ${name} already exists` })
    }

    // Prepare update data
    const updateData = {
        name,
        description,
        ingredients,
        preference,
        calories,
        protein,
        fat,
        carbs,
        mealImage
    };

    // Update meal item
    const updatedMealItem = await MealPlan.findByIdAndUpdate(mealId, updateData, {
        new: true,
        runValidators: true,
    });

    // Check if meal item was found and updated
    if (!updatedMealItem) {
        return res.status(404).json({ message: `Meal ID ${mealId} not found` });
    }

    // Success message
    res.json({ message: `Meal item ${updatedMealItem.name} updated successfully`, data: updatedMealItem });
});

// Delete meal item
const deleteMealPlan = asyncHandler(async (req, res) => {
    const { mealId } = req.params

    // Admin check
    if (!req.authUserData?.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Only admins can delete meal items" });
    }

    // Delete meal item
    const mealItem = await MealPlan.findByIdAndDelete(mealId).exec();

    if (!mealItem) {
        return res.status(404).json({ message: `Meal ID ${mealId} not found` });
    }

    // Success message
    res.json({ message: `Meal item ${mealItem.name} deleted successfully` });
})

// Export controller functions
module.exports = {
    getAllMealPlans,
    getMealPlan,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan
}