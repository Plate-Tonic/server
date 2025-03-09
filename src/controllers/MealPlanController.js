const asyncHandler = require("express-async-handler");

const { MealPlan } = require("../models/MealPlanModel");

// Create meal item
const createMealPlan = asyncHandler(async (req, res) => {
    let { name, description, ingredients, preference, calories, protein, fat, carbs } = req.body;

    // Confirm required fields are provided
    if (!name || !description || !ingredients || !preference || !calories || !protein || !fat || !carbs) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: "Meal image is required" });
    }

    const mealImage = `/uploads/${req.file.filename}`;

    if (!Array.isArray(preference)) {
        preference = preference.split(",").map((item) => item.trim()); // Ensure array format
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
    const { name, description, ingredients, preference, calories, protein, fat, carbs } = req.body;
    const { mealID } = req.params;

    // Check if a file was uploaded
    const mealImage = req.file ? req.file.path : null;

    // Confirm required fields are provided
    if (!name || !description || !ingredients || !preference || !calories || !protein || !fat || !carbs) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for duplicate meal item
    const duplicate = await MealPlan.findOne({ name }).exec()

    if (duplicate && duplicate?._id.toString() !== mealID) {
        return res.status(409).json({ message: `Meal item ${name} already exists` })
    }

    // Prepare update data
    const updateData = {
        name, description, ingredients, preference, calories, protein, fat, carbs, mealImage: mealImage || undefined,
    };

    // Update the meal item
    const updatedMealItem = await MealPlan.findByIdAndUpdate(mealID, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation runs on update
    });

    // Check if the item was found and updated
    if (!updatedMealItem) {
        return res.status(404).json({ message: `Meal ID ${mealID} not found` });
    }

    // Return the updated meal item
    res.json({ message: `Updated ${updatedMealItem.name}`, updatedMealItem });
});

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