const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    totalPrice: {
        type: Number
    },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" },
            price: { type: Number }
        }
    ]
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = {
    Order
};