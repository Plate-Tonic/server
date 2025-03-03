const { User } = require("../models/UserModel");
const { Order } = require("../models/OrderModel");

// Get a user
async function getUser(request, response) {
    try {
        const user = await User.findById(request.authUserData.userId)
            .populate('selectedMealPlan')
            .populate('selectedSubscription')
            .populate('orderHistory');

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        response.json(user);
    } catch (error) {
        console.error("Error fetching user: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Update a user's information
async function updateUser(request, response) {
    try {
        const { name, address, phoneNumber } = request.body;

        // Find user
        const user = await User.findById(request.authUserData.userId);
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        // Update properties
        if (name) user.name = name;
        if (address) user.address = address;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        // Save updated user information
        await user.save();

        response.json({ message: "User information updated successfully", data: user });
    } catch (error) {
        console.error("Error updating user: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Add meal plan
async function selectMealPlan(request, response) {
    try {
        const { selectedMealPlan, dietaryRestrictions } = request.body;

        // Find user
        const user = await User.findById(request.authUserData.userId);
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        // Check if the user has already selected a meal plan
        if (user.selectedMealPlan) {
            return response.status(400).json({ message: "Meal plan already selected." });
        }

        // Assign the selected meal plan and dietary restrictions
        user.selectedMealPlan = selectedMealPlan;
        user.dietaryRestrictions = dietaryRestrictions || "none"; // Default to "none" if not provided

        // Save updated user
        await user.save();

        response.json({ message: "Meal plan selected successfully", data: user });
    } catch (error) {
        console.error("Error selecting meal plan: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Update user's meal plan
async function updateMealPlan(request, response) {
    try {
        const { selectedMealPlan, dietaryRestrictions } = request.body;

        // Find user
        const user = await User.findById(request.authUserData.userId);
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        // Update properties
        if (selectedMealPlan) user.selectedMealPlan = selectedMealPlan;
        if (dietaryRestrictions) user.dietaryRestrictions = dietaryRestrictions;

        // Save updated user choices
        await user.save();

        response.json({ message: "Meal plan updated successfully", data: user });
    } catch (error) {
        console.error("Error updating meal plan: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Add subscription plan
async function selectSubscription(request, response) {
    try {
        const { selectedSubscription, deliveryFrequency } = request.body;

        // Find user
        const user = await User.findById(request.authUserData.userId);
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        // Check if the user has already selected a subscription
        if (user.selectedSubscription) {
            return response.status(400).json({ message: "Subscription already selected." });
        }

        // Assign the selected subscription and delivery frequency
        user.selectedSubscription = selectedSubscription;
        user.deliveryFrequency = deliveryFrequency || "monthly"; // Default to "monthly" if not provided

        // Save updated user
        await user.save();

        response.json({ message: "Subscription selected successfully", data: user });
    } catch (error) {
        console.error("Error selecting subscription: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Update user's subscription plan
async function updateSubscription(request, response) {
    try {
        const { selectedSubscription, deliveryFrequency } = request.body;

        // Find user
        const user = await User.findById(request.authUserData.userId);
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        // Update properties
        if (selectedSubscription) user.selectedSubscription = selectedSubscription;
        if (deliveryFrequency) user.deliveryFrequency = deliveryFrequency;

        // Save updated user choices
        await user.save();

        response.json({ message: "Subscription updated successfully", data: user });
    } catch (error) {
        console.error("Error updating subscription: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Get a user's order history
async function getOrderHistory(request, response) {
    try {
        const userId = request.authUserData.userId;

        // Fetch the user's order history from the Order model
        const orders = await Order.find({ user: userId })
            .populate('items.product');  // Populate the product field to get meal plan details

        if (orders.length === 0) {
            return response.status(404).json({ message: "No orders found for this user" });
        }

        // Respond with order history
        response.json({ orderHistory: orders });
    } catch (error) {
        console.error("Error fetching order history: ", error);
        response.status(500).json({ message: error.message });
    }
}


// Update macro tracker


// Export controller functions
module.exports = {
    getUser,
    selectMealPlan,
    updateUser,
    updateMealPlan,
    selectSubscription,
    updateSubscription,
    getOrderHistory
};