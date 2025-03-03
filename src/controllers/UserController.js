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
            return response.status(404).json({ message: "User not found." });
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
        const updatedUser = await User.findByIdAndUpdate(
            request.authUserData.userId,
            request.body,
            { new: true }
        );

        if (!updatedUser) {
            return response.status(404).json({ message: "User not found." });
        }

        response.json(updatedUser);
    } catch (error) {
        console.error("Error updating user: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Add meal plan
async function selectUserMealPlan(request, response) {
    try {
        const { selectedMealPlan, dietaryRestrictions } = request.body;

        // Find user
        const user = await User.findById(request.authUserData.userId);
        if (!user) {
            return response.status(404).json({ message: "User not found." });
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

        response.json({ selectedMealPlan, dietaryRestrictions });
    } catch (error) {
        console.error("Error selecting meal plan: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Update user's meal plan
async function updateUserMealPlan(request, response) {
    console.log(request.authUserData);
    try {
        const userId = request.authUserData.userId; // Get logged-in user's ID

        // Check if the user is an admin or updating their own meal plan
        if (request.authUserData.admin || userId === request.params.userId) {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { selectedMealPlan: request.body.selectedMealPlan },
                { new: true }
            );

            if (!updatedUser) {
                return response.status(404).json({ message: "User not found." });
            }

            response.json(updatedUser);
        } else {
            return response.status(403).json({ message: "Access denied. You do not have the required permissions." });
        }
    } catch (error) {
        console.error("Error updating meal plan: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Add subscription plan
async function selectUserSubscription(request, response) {
    try {
        const { selectedSubscription, deliveryFrequency } = request.body;

        // Find user
        const user = await User.findById(request.authUserData.userId);
        if (!user) {
            return response.status(404).json({ message: "User not found." });
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

        response.json({ selectedSubscription, deliveryFrequency });
    } catch (error) {
        console.error("Error selecting subscription: ", error);
        response.status(500).json({ message: error.message });
    }
}

// Update user's subscription plan
async function updateUserSubscription(request, response) {
    console.log(request.authUserData);
    try {
        const userId = request.authUserData.userId; // Get logged-in user's ID

        // Check if the user is an admin or updating their own subscription
        if (request.authUserData.admin || userId === request.params.userId) {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    selectedSubscription: request.body.selectedSubscription,
                    deliveryFrequency: request.body.deliveryFrequency
                },
                { new: true }
            );

            if (!updatedUser) {
                return response.status(404).json({ message: "User not found." });
            }

            response.json(updatedUser);
        } else {
            return response.status(403).json({ message: "Access denied. You do not have the required permissions." });
        }
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
            return response.status(404).json({ message: "No orders found for this user." });
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
    updateUser,
    selectUserMealPlan,
    updateUserMealPlan,
    selectUserSubscription,
    updateUserSubscription,
    getOrderHistory
};