const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    name: {
        type: String,
        required: true
    },
    address: {
        street: { type: String },
        suburb: { type: String },
        state: { type: String },
        postcode: { type: String }
    },
    stripeCustomerId: {
        type: String
    },
    macroTracker: {
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        height: { type: Number, required: true },
        weight: { type: Number, required: true },
        activity: { type: String, enum: ["sedentary", "lightly active", "moderately active", "very active", "extra active"], required: true },
        goal: { type: String, enum: ["lose weight", "maintain weight", "gain weight"], required: true },
        calorie: { type: Number, required: true },
        protein: { type: Number, required: true },
        fat: { type: Number, required: true },
        carbs: { type: Number, required: true }
    },
    selectedMealPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealPlan",
        dietaryRestrictions: { type: String, enum: ["vegetarian", "vegan", "gluten-free", "nut-free", "none"], default: "none" }
    },
    selectedSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        deliveryFrequency: { type: String, enum: ["weekly", "bi-weekly", "monthly"], default: "monthly" }
    },
    orderHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ]
});

const User = mongoose.model("User", UserSchema);

module.exports = {
    User
};