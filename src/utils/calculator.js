const calculateTDEE = (age, gender, height, weight, activity, goal) => {
    if (gender === "male") {
        if (activity === "sedentary") {
            return 66 + (6.2 * weight) + (12.7 * height) - (6.8 * age);
        } else if (activity === "lightly active") {
            return 66 + (6.2 * weight) + (12.7 * height) - (6.8 * age) * 1.375;
        } else if (activity === "moderately active") {
            return 66 + (6.2 * weight) + (12.7 * height) - (6.8 * age) * 1.55;
        } else if (activity === "very active") {
            return 66 + (6.2 * weight) + (12.7 * height) - (6.8 * age) * 1.725;
        } else if (activity === "extra active") {
            return 66 + (6.2 * weight) + (12.7 * height) - (6.8 * age) * 1.9;
        }
    } else if (gender === "female") {
        if (activity === "sedentary") {
            return 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age);
        } else if (activity === "lightly active") {
            return 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age) * 1.375;
        } else if (activity === "moderately active") {
            return 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age) * 1.55;
        } else if (activity === "very active") {
            return 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age) * 1.725;
        } else if (activity === "extra active") {
            return 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age) * 1.9;
        }
    }
};

const calculateProtein = (weight) => {
    return weight * 0.8;
};

const calculateFat = (calorie, protein) => {
    return calorie * 0.2 - protein * 4;
};

const calculateCarbs = (calorie, protein, fat) => {
    return calorie - protein * 4 - fat * 9;
};

module.exports = {
    calculateTDEE,
    calculateProtein,
    calculateFat,
    calculateCarbs
};