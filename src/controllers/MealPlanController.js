const { MealPlan } = require("../models/MealPlanModel");

// Create meal item
async function createMealPlan(name, imageUrl = null, description, ingredients, allergens, calories, protein, fat, carbs, response = null) {
    try {
        const mealPlan = await MealPlan.create({
            name,
            imageUrl,
            description,
            ingredients,
            allergens,
            calories,
            protein,
            fat,
            carbs
        });

        // If 'response' is provided (for Express route), send back the response
        if (response) {
            response.json(mealPlan);
        } else {
            console.log("Meal item created: ", mealPlan);
        }
    } catch (error) {
        console.error("Error creating meal item: ", error);

        // If 'response' is provided (for Express route), send error
        if (response) {
            response.status(500).json({ message: error.message });
        }
    }
}

// Get meal item
async function getMealPlan(request, response) {
    try {
        const mealPlan = await MealPlan.findById(request.params.mealID);
        if (!mealPlan) {
            return response.status(404).json({ message: "Meal item not found." });
        }

        response.json(mealPlan);
    } catch (error) {
        console.error("Error fetching meal item: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Get all meal items
async function getAllMealPlans(request, response) {
    try {
        const mealPlans = await MealPlan.find({});

        response.json(mealPlans);
    } catch (error) {
        console.error("Error fetching meal items: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Update meal item
async function updateMealPlan(request, response) {
    try {
        const updatedMealPlan = await MealPlan.findByIdAndUpdate(
            request.params.mealID,
            request.body,
            { new: true }
        );

        if (!updatedMealPlan) {
            return response.status(404).json({ message: "Meal item not found." });
        }

        response.json(updatedMealPlan);
    } catch (error) {
        console.error("Error updating meal item: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Delete meal item
async function deleteMealPlan(request, response) {
    try {
        const mealPlan = await MealPlan.findByIdAndDelete(request.params.mealID);
        if (!mealPlan) {
            return response.status(404).json({ message: "Meal item not found." });
        }

        response.json({ message: "Meal item deleted." });
    } catch (error) {
        console.error("Error deleting meal item: ", error);
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