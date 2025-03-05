const calculateCalories = (age, gender, height, weight, activity, goal) => {
    let bmr;

    // Calculate Basal Metabolic Rate
    if (gender === "male") {
        bmr = 66 + (6.2 * weight) + (12.7 * height) - (6.8 * age);
    } else if (gender === "female") {
        bmr = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age);
    }

    // Apply activity multiplier
    if (activity === "sedentary") {
        bmr *= 1.2;
    } else if (activity === "lightly active") {
        bmr *= 1.375;
    } else if (activity === "moderately active") {
        bmr *= 1.55;
    } else if (activity === "very active") {
        bmr *= 1.725;
    } else if (activity === "extra active") {
        bmr *= 1.9;
    }

    // Goal (weight loss, maintenance, or gain) adjustment
    if (goal === "lose") {
        bmr -= 500; // Calorie deficit
    } else if (goal === "gain") {
        bmr += 500; // Calorie surplus
    }

    return bmr;
};

const calculateProtein = (weight) => {
    return weight * 0.8;
};

const calculateFat = (calorie, protein) => {
    return (calorie * 0.2) / 9;
};

const calculateCarbs = (calorie, protein, fat) => {
    return (calorie - (protein * 4) - (fat * 9)) / 4;
};

module.exports = {
    calculateCalories,
    calculateProtein,
    calculateFat,
    calculateCarbs
};