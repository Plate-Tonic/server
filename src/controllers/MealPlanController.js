const { MealPlan } = require("../models/MealPlanModel");

// Create meal item
async function createMealPlan(name, description, ingredients) {
    try {
        const mealPlan = await MealPlan.create({
            name,
            imageUrl,
            calories,
            protein,
            fat,
            carbs,
            ingredients,
            description,
            allergens,
        });

        return mealPlan;
    } catch (error) {
        console.error("Error creating meal item: ", error);
        throw new Error(error.message);
    }
}

// Get meal item
async function getMealPlan(request, response) {
    try {
        const mealPlan = await MealPlan.findById(request.params.id);
        if (!mealPlan) {
            return response.status(404).json({ message: "Meal item not found." });
        }

        response.json(mealPlan);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

// Get all meal items
async function getAllMealPlans(request, response) {
    try {
        const mealPlans = await MealPlan.find({});

        response.json(mealPlans);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

// Update meal item
async function updateMealPlan(request, response) {
    try {
        const mealPlan = await MealPlan.findById(request.params.id);
        if (!mealPlan) {
            return response.status(404).json({ message: "Meal item not found." });
        }

        mealPlan.title = request.body.title;
        mealPlan.author = request.body.author;
        mealPlan.content = request.body.content;
        mealPlan.tags = request.body.tags;

        await mealPlan.save();

        response.json(mealPlan);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

// Delete meal item
async function deleteMealPlan(request, response) {
    try {
        const mealPlan = await MealPlan.findByIdAndDelete(request.params.id);
        if (!mealPlan) {
            return response.status(404).json({ message: "Meal item not found." });
        }

        response.json({ message: "Meal item deleted." });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

// Export controller functions
module.exports = {
    createMealPlan,
    getMealPlan,
    getAllMealPlans,
    updateMealPlan,
    deleteMealPlan
}