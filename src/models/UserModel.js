const mongoose = require("mongoose");
const { MealPlan } = require("./MealPlanModel");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    macroTracker: {
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        height: { type: Number, required: true },
        weight: { type: Number, required: true },
        activity: {
            type: String,
            enum: [
                "Sedentary (little or no exercise)",
                "Lightly active (light exercise 1-3 days/week)",
                "Moderately active (moderate exercise 3-5 days/week)",
                "Very active (hard exercise 6-7 days/week)",
                "Super active (very intense exercise, physical job, etc.)"],
            required: true
        },
        goal: {
            type: String,
            enum: [
                "Lose Weight",
                "Maintain Weight",
                "Gain Muscle"
            ],
            required: true
        },
        calorie: { type: Number, required: true },
        protein: { type: Number, required: true },
        fat: { type: Number, required: true },
        carbs: { type: Number, required: true }
    },
    selectedMealPlan: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealPlan",
        dietaryPreference: { type: String, enum: ["vegetarian", "vegan", "gluten-free", "nut-free", "none"], default: "none" }
    }]
});

const User = mongoose.model("User", UserSchema);

module.exports = {
    User
};