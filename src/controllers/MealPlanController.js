const asyncHandler = require("express-async-handler");

const { MealPlan } = require("../models/MealPlanModel");

// Create meal item
const createMealPlan = asyncHandler(async (req, res) => {
    const { name, imageUrl, description, ingredients, preference, calories, protein, fat, carbs } = req.body;

    // Confirm required fields are provided
    if (!name || !description || !ingredients || !preference || !calories || !protein || !fat || !carbs) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate meal item
    const duplicate = await MealPlan.findOne({ name }).exec();

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate meal item" });
    }

    // Create and store new meal item
    const mealItem = await MealPlan.create({
        name, imageUrl, description, ingredients, preference, calories, protein, fat, carbs
    });

    // Success or error message
    if (mealItem) {
        res.status(201).json({ message: "New meal item created" });
    } else {
        res.status(500).json({ message: "Error creating meal item" });
    }
});

// Get meal item
const getMealPlan = asyncHandler(async (req, res) => {
    // Extract meal ID from request parameters
    const { mealID } = req.params;

    // Fetch meal item by ID
    const mealItem = await MealPlan.findById(mealID);

    // Check if meal item exists
    if (!mealItem) {
        return res.status(404).json({ message: `Meal ID ${mealID} not found` });
    }

    // Return meal item
    res.json(mealItem);
});

// Get all meal items
const getAllMealPlans = asyncHandler(async (req, res) => {
    // Fetch meal items from the database
    const mealItems = await MealPlan.find();

    // Check if meal items exists
    if (!mealItems || mealItems.length === 0) {
        return res.status(404).json({ message: "No meal items found" });
    }

    // Return meal items
    res.json(mealItems);
});

// Update meal item
const updateMealPlan = asyncHandler(async (req, res) => {
    const { name, imageUrl, description, ingredients, preference, calories, protein, fat, carbs } = req.body;

    // Extract meal ID from the request parameters
    const { mealID } = req.params;

    // Confirm required fields are provided
    if (!name || !description || !ingredients || !preference || !calories || !protein || !fat || !carbs) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch meal item by ID
    const mealItem = await MealPlan.findById(mealID).exec();

    // Check if meal item exists
    if (!mealItem) {
        return res.status(404).json({ message: `Meal ID ${mealID} not found` });
    }

    // Check for duplicate meal item
    const duplicate = await MealPlan.findOne({ name }).exec()

    // Update meal item if no duplicate exists, or it's the same meal item
    if (duplicate && duplicate?._id.toString() !== mealID) {
        return res.status(409).json({ message: "Duplicate meal item" })
    }

    // Update meal item with new data
    mealItem.name = name
    mealItem.imageUrl = imageUrl
    mealItem.description = description
    mealItem.ingredients = ingredients
    mealItem.preference = preference
    mealItem.calories = calories
    mealItem.protein = protein
    mealItem.fat = fat
    mealItem.carbs = carbs

    // Save updated meal item
    const updatedMealItem = await mealItem.save()

    // Success message
    res.json({ message: `Updated ${updatedMealItem.name}` })
})

// Delete meal item
const deleteMealPlan = asyncHandler(async (req, res) => {
    // Extract meal ID from request parameters
    const { mealID } = req.params

    // Check if meal ID is provided
    if (!mealID) {
        return res.status(400).json({ message: "Meal ID required" });
    }

    // Delete meal item
    const mealItem = await MealPlan.findByIdAndDelete(mealID).exec();

    if (!mealItem) {
        return res.status(404).json({ message: `Meal ID ${mealID} not found` });
    }

    // Success message
    res.json({ message: `Deleted ${mealItem.name}` });
})

// Export controller functions
module.exports = {
    createMealPlan,
    getMealPlan,
    getAllMealPlans,
    updateMealPlan,
    deleteMealPlan
}