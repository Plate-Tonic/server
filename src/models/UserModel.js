const mongoose = require("mongoose");
const { MealPlan } = require("./MealPlanModel");
const { securityQuestions } = require("../utils/securityQuestions");

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
    securityQuestion: {
        type: String,
        required: true,
        enum: securityQuestions,
    },
    securityAnswer: {
        type: String,
        required: true
    },
    macroTracker: {
        age: { type: Number, required: false },
        gender: { type: String, required: false },
        height: { type: Number, required: false },
        weight: { type: Number, required: false },
        activity: {
            type: String,
            enum: [
                "Sedentary (little or no exercise)",
                "Lightly active (light exercise 1-3 days/week)",
                "Moderately active (moderate exercise 3-5 days/week)",
                "Very active (hard exercise 6-7 days/week)",
                "Super active (very intense exercise, physical job, etc.)"],
            required: false
        },
        goal: {
            type: String,
            enum: [
                "Lose Weight",
                "Maintain Weight",
                "Gain Muscle"
            ],
            required: false
        },
        calorie: { type: Number, required: false },
        protein: { type: Number, required: false },
        fat: { type: Number, required: false },
        carbs: { type: Number, required: false }
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