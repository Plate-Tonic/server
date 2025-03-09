const mongoose = require("mongoose");
const { MealPlan } = require("./MealPlanModel");
const { securityQuestions } = require("../utils/securityQuestions");

// Schema for users
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
        age: { type: Number },
        gender: { type: String },
        height: { type: Number },
        weight: { type: Number },
        activity: {
            type: String,
            enum: [
                "Sedentary (little or no exercise)",
                "Lightly active (light exercise 1-3 days/week)",
                "Moderately active (moderate exercise 3-5 days/week)",
                "Very active (hard exercise 6-7 days/week)",
                "Super active (very intense exercise, physical job, etc.)"]
        },
        goal: {
            type: String,
            enum: [
                "Lose Weight",
                "Maintain Weight",
                "Gain Muscle"
            ]
        },
        calories: { type: Number },
        protein: { type: Number },
        fat: { type: Number },
        carbs: { type: Number }
    },
    selectedMealPlan: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealPlan",
        dietaryPreference: {
            type: String,
            enum: [
                "vegetarian",
                "vegan",
                "gluten-free",
                "nut-free"
            ]
        }
    }]
});

// Model for users
const User = mongoose.model("User", UserSchema);

module.exports = {
    User
};