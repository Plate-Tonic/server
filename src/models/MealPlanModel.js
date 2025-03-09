const mongoose = require("mongoose");

const MealPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    preference: {
        type: [String],
        enum: ["vegetarian", "vegan", "gluten-free", "nut-free", "none"],
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    mealImage: {
        type: String,
        required: true
    }
});

const MealPlan = mongoose.model("MealPlan", MealPlanSchema);

module.exports = {
    MealPlan
};