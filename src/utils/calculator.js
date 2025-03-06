const calculateCalories = (age, weight, height, gender, activity, goal) => {
    let calories;

    // Calculate Basal Metabolic Rate
    if (gender === "male") {
        calories = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else if (gender === "female") {
        calories = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Apply activity multiplier
    if (activity === "Sedentary (little or no exercise)") {
        calories *= 1.2;
    } else if (activity === "Lightly active (light exercise 1-3 days/week)") {
        calories *= 1.375;
    } else if (activity === "Moderately active (moderate exercise 3-5 days/week)") {
        calories *= 1.55;
    } else if (activity === "Very active (hard exercise 6-7 days/week)") {
        calories *= 1.725;
    } else if (activity === "Super active (very intense exercise, physical job, etc.)") {
        calories *= 1.9;
    }

    // Goal (weight loss, maintenance, or gain) adjustment
    if (goal === "weight-loss") {
        calories -= 500; // Calorie deficit
    } else if (goal === "muscle-gain") {
        calories += 500; // Calorie surplus
    }
    return Math.round(calories);
};

const calculateProtein = (calories) => {
    let protein;
    protein = (calories * 0.3) / 4;
    return Math.round(protein);
};

const calculateFat = (calories) => {
    let fat;
    fat = (calories * 0.35) / 9;
    return Math.round(fat);
};

const calculateCarbs = (calories) => {
    let carbs;
    carbs = (calories * 0.35) / 4;
    return Math.round(carbs);
};

module.exports = {
    calculateCalories,
    calculateProtein,
    calculateFat,
    calculateCarbs
};