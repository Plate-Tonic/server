const { calculateCalories, calculateProtein, calculateFat, calculateCarbs } = require("../../utils/calculator");

describe("Calculate Calories", () => {
    it("should calculate calories for a male with light activity and weight loss goal", () => {
        const age = 25;
        const weight = 70;
        const height = 175;
        const gender = "male";
        const activity = "Lightly active (light exercise 1-3 days/week)";
        const goal = "weight-loss";

        const result = calculateCalories(age, weight, height, gender, activity, goal);

        expect(result).toBe(1801); // BMR: 1673.75, Activity multiplier: 2301.41
    });

    it("should calculate calories for a female with very active activity and muscle gain goal", () => {
        const age = 30;
        const weight = 60;
        const height = 160;
        const gender = "female";
        const activity = "Very active (hard exercise 6-7 days/week)";
        const goal = "muscle-gain";

        const result = calculateCalories(age, weight, height, gender, activity, goal);

        expect(result).toBe(2724); // BMR: 1289, Activity multiplier: 2223.53
    });

});

describe("Calculate Protein", () => {
    it("should calculate protein based on the calories of a male with light activity and weight loss goal", () => {
        const calories = 1801;

        const result = calculateProtein(calories);

        expect(result).toBe(135); // (30% of 1801) / 4
    });

    it("should calculate protein based on the calories of a female with very active activity and muscle gain goal", () => {
        const calories = 2724;

        const result = calculateProtein(calories);

        expect(result).toBe(204); // (30% of 2724) / 4
    });
});

describe("Calculate Fat", () => {
    it("should calculate fat based on the calories of a male with light activity and weight loss goal", () => {
        const calories = 1801;

        const result = calculateFat(calories);

        expect(result).toBe(70); // (35% of 1801) / 9
    });

    it("should calculate fat based on the calories of a female with very active activity and muscle gain goal", () => {
        const calories = 2724;

        const result = calculateFat(calories);

        expect(result).toBe(106); // (35% of 2724) / 9
    });
});

describe("Calculate Carbs", () => {
    it("should calculate carbs based on the calories of a male with light activity and weight loss goal", () => {
        const calories = 1801;

        const result = calculateCarbs(calories);

        expect(result).toBe(158); // (35% of 1801) / 4
    });

    it("should calculate carbs based on the calories of a female with very active activity and muscle gain goal", () => {
        const calories = 2724;
        
        const result = calculateCarbs(calories);

        expect(result).toBe(238); // (35% of 2724) / 4
    });
});
