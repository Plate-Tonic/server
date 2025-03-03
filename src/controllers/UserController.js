const { User } = require("../models/UserModel");

// Get a user
async function getUser(request, response) {
    try {
        const user = await User.findById(request.authUserData.userId)
            .populate('selectedMealPlan')

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
        const { selectedMealPlan, dietaryPreference } = request.body;

        // Find user
        const user = await User.findById(request.authUserData.userId);
        if (!user) {
            return response.status(404).json({ message: "User not found." });
        }

        // Check if the user has already selected a meal plan
        if (user.selectedMealPlan) {
            return response.status(400).json({ message: "Meal plan already selected." });
        }

        // Assign the selected meal plan and dietary preferences
        user.selectedMealPlan = selectedMealPlan;
        user.dietaryPreference = dietaryPreference || "none"; // Default to "none" if not provided

        // Save updated user
        await user.save();

        response.json({ selectedMealPlan, dietaryPreference });
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

// Update macro tracker


// Export controller functions
module.exports = {
    getUser,
    updateUser,
    selectUserMealPlan,
    updateUserMealPlan,
};